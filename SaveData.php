<?php
// 連接資料庫
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "feng37bank";

$conn = new mysqli($servername, $username, $password, $dbname);

// 檢查連接
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 獲取資料
    $userName = $_POST['userName'];
    $bankSavings = json_decode($_POST['bankSavings'], true);

    // 檢查 userName 和 bankSavings 是否有效
    if (empty($userName) || !is_array($bankSavings)) {
        echo json_encode(['success' => false]);
        exit;
    }

    // 檢查是否已存在 userName 的資料
    $checkUserSql = "SELECT * FROM bankdata WHERE userName = ?";
    $stmtCheck = $conn->prepare($checkUserSql);
    $stmtCheck->bind_param('s', $userName);
    $stmtCheck->execute();
    $result = $stmtCheck->get_result();

    if ($result->num_rows > 0) {
        // 如果存在，執行更新資料
        $sql = "UPDATE bankdata SET 
                bank0 = ?, bank1 = ?, bank2 = ?, bank3 = ?, bank4 = ?, 
                bank5 = ?, bank6 = ?, bank7 = ?, bank8 = ?, bank9 = ? 
                WHERE userName = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            'iiiiiiiiiss', 
            $bankSavings[0],
            $bankSavings[1],
            $bankSavings[2],
            $bankSavings[3],
            $bankSavings[4],
            $bankSavings[5],
            $bankSavings[6],
            $bankSavings[7],
            $bankSavings[8],
            $bankSavings[9],
            $userName
        );

        if ($stmt->execute()) {
            // 更新成功
            echo json_encode(['success' => true, 'message' => 'Data updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update data']);
        }

    } else {
        // 如果不存在，執行新增資料
        $sql = "INSERT INTO bankdata (userName, bank0, bank1, bank2, bank3, bank4, bank5, bank6, bank7, bank8, bank9) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            'siiiiiiiiii', 
            $userName,
            $bankSavings[0],
            $bankSavings[1],
            $bankSavings[2],
            $bankSavings[3],
            $bankSavings[4],
            $bankSavings[5],
            $bankSavings[6],
            $bankSavings[7],
            $bankSavings[8],
            $bankSavings[9]
        );

        if ($stmt->execute()) {
            // 新增成功
            echo json_encode(['success' => true, 'message' => 'Data inserted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to insert data']);
        }
    }

    // 關閉資料庫連線
    $stmtCheck->close();
    $stmt->close();
    $conn->close();

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
