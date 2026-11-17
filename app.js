let students = JSON.parse(localStorage.getItem('fee_students')) || [
    { id: 1, name: "Rahul Sharma", phone: "919876543210", month: "November", year: "2026", amount: 1500, status: "Pending" },
    { id: 2, name: "Priya Patel", phone: "919123456789", month: "November", year: "2026", amount: 1200, status: "Paid" }
];

function saveData() {
    localStorage.setItem('fee_students', JSON.stringify(students));
    renderStudents();
}

function renderStudents() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const fMonth = document.getElementById('filterMonth').value;
    const fStatus = document.getElementById('filterStatus').value;
    const listEl = document.getElementById('studentList');

    const filtered = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search) || s.phone.includes(search);
        const matchesMonth = fMonth === "" || s.month === fMonth;
        const matchesStatus = fStatus === "" || s.status === fStatus;
        return matchesSearch && matchesMonth && matchesStatus;
    });

    // Update Analytics
    document.getElementById('totalCount').innerText = students.length;
    document.getElementById('pendingCount').innerText = students.filter(s => s.status === 'Pending').length;
    const collected = students.filter(s => s.status === 'Paid').reduce((acc, curr) => acc + Number(curr.amount), 0);
    document.getElementById('collectedAmount').innerText = '₹' + collected;

    if (filtered.length === 0) {
        listEl.innerHTML = `<div class="text-center py-10 text-slate-400 text-sm bg-white rounded-xl border border-slate-100">No records found.</div>`;
        return;
    }

    listEl.innerHTML = filtered.map(s => `
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-3">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold text-slate-800">${s.name}</h4>
                    <p class="text-xs text-slate-500"><i class="fa-solid fa-phone mr-1"></i>+${s.phone}</p>
                </div>
                <span class="px-2.5 py-1 text-xs font-semibold rounded-full ${s.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}">
                    ${s.status}
                </span>
            </div>
            <div class="flex justify-between items-center text-sm bg-slate-50 p-2.5 rounded-lg">
                <div>
                    <p class="text-xs text-slate-500">Fee Period</p>
                    <p class="font-semibold text-slate-700">${s.month} ${s.year}</p>
                </div>
                <div class="text-right">
                    <p class="text-xs text-slate-500">Amount</p>
                    <p class="font-bold text-slate-800">₹${s.amount}</p>
                </div>
            </div>
            <div class="flex gap-2 pt-1">
                ${s.status === 'Pending' ? 
                    `<button onclick="sendWhatsAppReminder(${s.id})" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5">
                        <i class="fa-brands fa-whatsapp text-sm"></i> Send Reminder
                    </button>` :
                    `<button onclick="sendWhatsAppReceipt(${s.id})" class="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5">
                        <i class="fa-brands fa-whatsapp text-sm"></i> Send Receipt
                    </button>`
                }
                <button onclick="editStudent(${s.id})" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-medium transition">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button onclick="deleteStudent(${s.id})" class="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-2 rounded-lg text-xs font-medium transition">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function sendWhatsAppReminder(id) {
    const s = students.find(item => item.id === id);
    const msg = `Hello Parent,\n\nThis is a fee reminder from your teacher/institution. The tuition fee of *₹${s.amount}* for the month of *${s.month} ${s.year}* for your child *${s.name}* is currently pending.\n\nPlease clear the dues at your earliest convenience.\n\nThank you!`;
    window.open(`https://wa.me/${s.phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

function sendWhatsAppReceipt(id) {
    const s = students.find(item => item.id === id);
    const msg = `Hello Parent,\n\nThank you! We have successfully received the fee payment of *₹${s.amount}* for *${s.month} ${s.year}* for your child *${s.name}*.\n\nPayment Status: *PAID* ✅\n\nRegards,\nInstitution / Teacher`;
    window.open(`https://wa.me/${s.phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

function openAddModal() {
    document.getElementById('modalTitle').innerText = "Add New Student";
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = "";
    document.getElementById('studentModal').classList.remove('hidden');
}

function editStudent(id) {
    const s = students.find(item => item.id === id);
    document.getElementById('modalTitle').innerText = "Edit Student Details";
    document.getElementById('studentId').value = s.id;
    document.getElementById('name').value = s.name;
    document.getElementById('phone').value = s.phone;
    document.getElementById('month').value = s.month;
    document.getElementById('year').value = s.year;
    document.getElementById('amount').value = s.amount;
    document.getElementById('status').value = s.status;
    document.getElementById('studentModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('studentModal').classList.add('hidden');
}

function saveStudent(e) {
    e.preventDefault();
    const id = document.getElementById('studentId').value;
    const data = {
        id: id ? Number(id) : Date.now(),
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        month: document.getElementById('month').value,
        year: document.getElementById('year').value,
        amount: Number(document.getElementById('amount').value),
        status: document.getElementById('status').value
    };

    if (id) {
        const index = students.findIndex(item => item.id === Number(id));
        students[index] = data;
    } else {
        students.push(data);
    }

    saveData();
    closeModal();
}

function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this record?")) {
        students = students.filter(item => item.id !== id);
        saveData();
    }
}

// Initial Load when window loads
window.onload = renderStudents;
