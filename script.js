// متغيرات لتخزين بيانات المدخولات والمصاريف
let incomes = [];
let expenses = [];

// دالة لتحديث قائمة المدخولات في الصفحة
function updateIncomeList() {
  const list = document.getElementById('income-list');
  list.innerHTML = '';
  incomes.forEach((income, index) => {
    const li = document.createElement('li');
    li.textContent = `${income.source} : ${income.amount}`;
    // إمكانية الحذف
    const delBtn = document.createElement('button');
    delBtn.textContent = 'حذف';
    delBtn.style.marginLeft = '10px';
    delBtn.onclick = () => {
      incomes.splice(index, 1);
      updateIncomeList();
    };
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// دالة لتحديث قائمة المصاريف في الصفحة
function updateExpenseList() {
  const list = document.getElementById('expense-list');
  list.innerHTML = '';
  expenses.forEach((expense, index) => {
    const li = document.createElement('li');
    li.textContent = `${expense.item} : ${expense.amount}`;
    // إمكانية الحذف
    const delBtn = document.createElement('button');
    delBtn.textContent = 'حذف';
    delBtn.style.marginLeft = '10px';
    delBtn.onclick = () => {
      expenses.splice(index, 1);
      updateExpenseList();
    };
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// إضافة حدث زر "إضافة دخل"
document.getElementById('add-income-btn').addEventListener('click', () => {
  const source = document.getElementById('income-source').value.trim();
  const amount = parseFloat(document.getElementById('income-amount').value);
  if (source !== '' && !isNaN(amount)) {
    incomes.push({ source, amount });
    updateIncomeList();
    // إعادة تعيين القيم
    document.getElementById('income-source').value = '';
    document.getElementById('income-amount').value = '';
  }
});

// إضافة حدث زر "إضافة مصروف"
document.getElementById('add-expense-btn').addEventListener('click', () => {
  const item = document.getElementById('expense-item').value.trim();
  const amount = parseFloat(document.getElementById('expense-amount').value);
  if (item !== '' && !isNaN(amount)) {
    expenses.push({ item, amount });
    updateExpenseList();
    // إعادة تعيين القيم
    document.getElementById('expense-item').value = '';
    document.getElementById('expense-amount').value = '';
  }
});

// حدث زر "حفظ البيانات"
document.getElementById('submit-btn').addEventListener('click', () => {
  const startTime = document.getElementById('start-time').value;
  const endTime = document.getElementById('end-time').value;

  // التحقق من صحة المدخلات
  if (!startTime || !endTime) {
    alert('يرجى تحديد بداية ونهاية اليوم');
    return;
  }
  
  const data = {
    start_time: startTime,
    end_time: endTime,
    incomes: incomes,
    expenses: expenses
  };

  // إرسال البيانات إلى API باستخدام fetch
  fetch("https://msdonerbk.onrender.com/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    // عرض النتيجة في الصفحة
    document.getElementById('result').textContent = JSON.stringify(result, null, 2);
    // إعادة تعيين البيانات بعد النجاح
    incomes = [];
    expenses = [];
    updateIncomeList();
    updateExpenseList();
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('result').textContent = 'حدث خطأ أثناء إرسال البيانات.';
  });
});
