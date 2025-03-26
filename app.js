const { useState, useEffect } = React;
const root = ReactDOM.createRoot(document.getElementById("root"));

function Feng37() {
  const [bankSavings, setBankSavings] = useState(Array(10).fill(0));
  const [saving, setSaving] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sumSaving, setSumSaving] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setSaving(bankSavings[0]);
    setSelectedIndex(0);
    setSumSaving(bankSavings.reduce((sum, num) => sum + parseInt(num), 0));

    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
      fetchUserData(storedUserName);
    }
  }, []);

  function fetchUserData(user) {
    fetch("LoadData.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ userName: user }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBankSavings(data.bankSavings);
          setSumSaving(
            data.bankSavings.reduce((sum, num) => sum + parseInt(num), 0)
          );
          setSaving(data.bankSavings[selectedIndex]);
        } else {
          Swal.fire({
            title: "錯誤",
            text: "無法讀取該使用者的資料",
            icon: "error",
          });
        }
      })
      .catch(() =>
        Swal.fire({ title: "錯誤", text: "無法連接到伺服器", icon: "error" })
      );
  }

  function handleSelectChange(e) {
    let index = e.target.selectedIndex;
    setSelectedIndex(index);
    setSaving(bankSavings[index]);
  }

  function handleInputChange(e) {
    let value = e.target.value;
    if (
      isNaN(value) ||
      value.includes(".") ||
      !Number.isInteger(Number(value))
    ) {
      setSumSaving("請輸入正整數或零");
      setSaving(0);
      let updatedSavings = [...bankSavings];
      updatedSavings[selectedIndex] = 0;
      setBankSavings(updatedSavings);
    } else {
      let updatedSavings = [...bankSavings];
      updatedSavings[selectedIndex] = value;
      setBankSavings(updatedSavings);
      setSaving(value);
      setSumSaving(updatedSavings.reduce((sum, num) => sum + parseInt(num), 0));
    }
  }

  function handleUserNameChange(e) {
    setUserName(e.target.value);
  }

  function handleLoadData() {
    if (!userName) {
      Swal.fire({
        title: "讀檔",
        text: "臨時使用者名稱不得為空值",
        icon: "error",
      });
      return;
    }
    localStorage.setItem("userName", userName);
    fetchUserData(userName);
  }

  function handleSaveData() {
    if (!userName) {
      Swal.fire({
        title: "存檔",
        text: "臨時使用者名稱不得為空值",
        icon: "error",
      });
      return;
    }
    localStorage.setItem("userName", userName);

    fetch("SaveData.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        userName: userName,
        bankSavings: JSON.stringify(bankSavings),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Swal.fire({ title: "成功", text: "資料已成功儲存", icon: "success" });
        } else {
          Swal.fire({
            title: "錯誤",
            text: "儲存資料時發生錯誤",
            icon: "error",
          });
        }
      })
      .catch(() =>
        Swal.fire({ title: "錯誤", text: "無法連接到伺服器", icon: "error" })
      );
  }

  function handleEgg() {
    Swal.fire({
      title: "㊣",
      html: "委任第五職等<br>簡任第十二職等<br>第12屆臺北市長<br>第23任總統<br>中央銀行鋒兄分行",
      icon: "success",
    });
  }

  return (
    <div className="container mx-auto p-4 bg-blue-500 text-white text-center rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-yellow-300">
        <i className="fas fa-university"></i> React_鋒兄三七_銀行
      </h1>

      <div className="mt-4">
        <h3>
          <i className="fas fa-user"></i> 臨時使用者名稱：
        </h3>
        <input
          type="text"
          value={userName}
          className="p-2 rounded text-black"
          minLength="1"
          maxLength="10"
          size="10"
          onChange={handleUserNameChange}
        />
      </div>

      <div className="mt-4">
        <h3>
          <i className="fas fa-building"></i> 金融機構：
        </h3>
        <select
          className="p-2 rounded text-black"
          onChange={handleSelectChange}
        >
            <option>(006)合作金庫(5880)</option>
            <option>(012)台北富邦(2881)</option>
            <option>(013)國泰世華(2882)</option>
            <option>(017)兆豐銀行(2886)</option>
            <option>(048)王道銀行(2897)</option>
            <option>(103)新光銀行(2888)</option>
            <option>(700)中華郵政</option>
            <option>(808)玉山銀行(2884)</option>
            <option>(812)台新銀行(2887)</option>
            <option>(822)中國信託(2891)</option>
        </select>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg text-center">
          <i className="fas fa-coins"></i> 存款金額：
        </h3>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={saving}
            className="p-2 rounded text-black border border-gray-300"
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center space-y-4">
        <h3 className="text-lg text-center">
          <i className="fas fa-piggy-bank"></i> 累積存款：
        </h3>

        <div className="flex items-center space-x-4">
          <span className="text-yellow-300 text-2xl">{sumSaving}</span>
        </div>
      </div>
      <div className="mt-4 space-x-4">
        <button className="p-2 bg-blue-700 rounded" onClick={handleLoadData}>
          <i className="fas fa-folder-open"></i> 讀檔
        </button>
        <button className="p-2 bg-blue-700 rounded" onClick={handleSaveData}>
          <i className="fas fa-save"></i> 存檔
        </button>
        <button className="p-2 bg-blue-700 rounded" onClick={handleEgg}>
          <i className="fas fa-gift"></i> 彩蛋
        </button>
      </div>
<div className="mt-4 flex justify-center items-center space-x-4">
  <img src="YuShan.webp" width="60" height="60" />
  <img src="PiggyBank.webp" width="60" height="60" />
</div>
    </div>

  );
}

root.render(<Feng37 />);
