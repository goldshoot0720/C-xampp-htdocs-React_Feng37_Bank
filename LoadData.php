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

    // 檢查 userName 是否有效
    if (empty($userName)) {
        echo json_encode(['success' => false, 'message' => 'User name is required']);
        exit;
    }

    // 查詢資料庫中是否有該用戶資料
    $checkUserSql = "SELECT * FROM bankdata WHERE userName = ?";
    $stmtCheck = $conn->prepare($checkUserSql);
    $stmtCheck->bind_param('s', $userName);
    $stmtCheck->execute();
    $result = $stmtCheck->get_result();

    if ($result->num_rows > 0) {
        // 找到資料，將資料返回
        $row = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'userName' => $row['userName'],
            'bankSavings' => [
                $row['bank0'],
                $row['bank1'],
                $row['bank2'],
                $row['bank3'],
                $row['bank4'],
                $row['bank5'],
                $row['bank6'],
                $row['bank7'],
                $row['bank8'],
                $row['bank9']
            ]
        ]);
    } else {
        // 如果資料不存在
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }

    // 關閉資料庫連線
    $stmtCheck->close();
    $conn->close();

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
