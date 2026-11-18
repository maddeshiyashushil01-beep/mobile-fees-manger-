const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxgOn9QiCK9ZnEjtMdsmeBcldIouSNjKiQliWKEJKoBSDzdyfpFIMkfGWjt0UuZkiRNcQ/exec";
let students = [];

// Show loading state when fetching data
document.getElementById('studentList').innerHTML = `<div class="text-center py-10 text-slate-500 font-medium animate-pulse">Loading data from Google Sheets...</div>`;

// Fetch data from Google Sheet
async function loadData() {
    try {
        const response = await fetch(SCRIPT_URL);
        students = await response.json();
        renderStudents();
    } catch (error) {
        document.getElementById('studentList').innerHTML = `<div class="text-center py-10 text-rose-500 font-medium">Error loading data. Please check your internet connection.</div>`;
    }
}

// Render the student cards
function renderStudents() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const listEl = document.getElementById('studentList');

    // Filter by name or phone
    const filtered = students.filter(s => s.name.toLowerCase().includes(search) || String(s.phone).includes(search));

    // Update Dashboard Stats
    document.getElementById('totalCount').innerText = students.length;
    document.getElementById('pendingCount').innerText = students.filter(s => s.status === 'Pending').length;
    document.getElementById('collectedAmount').innerText = '₹' + students.filter(s => s.status === 'Paid').reduce((acc, curr) => acc + Number(curr.amount), 0);

    if (filtered.length === 0) {
        listEl.innerHTML = `<div class="text-center py-10 text-slate-400 text-sm bg-white rounded-xl border border-slate-100">No records found.</div>`;
        return;
    }

    // Build the HTML for each student card
    listEl.innerHTML = filtered.map(s => {
        // Format dates cleanly for display (handling cases where date might be empty)
        const admDate = s.admission_date ? new Date(s.admission_date).toLocaleDateString() : 'N/A';
        const payDate = s.payment_date ? new Date(s.payment_date).toLocaleDateString() : 'N/A';

        return `
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-3">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold text-slate-800">${s.name} <span class="text-xs font-normal text-slate-500">(Sec: ${s.section || '-'})</span></h4>
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

            <div class="text-xs text-slate-500 flex justify-between px-1">
                <span>Admitted: ${admDate}</span>
                <span>Paid: ${s.status === 'Paid' ? payDate : '-'}</span>
            </div>

            <div class="flex gap-2 pt-1">
                ${s.status === 'Pending' ? 
                    `<button onclick="sendWhatsAppReminder(${s.id})" class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5"><i class="fa-brands fa-whatsapp text-sm"></i> Reminder</button>` :
                    `<button onclick="sendWhatsAppReceipt(${s.id})" class="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5"><i class="fa-brands fa-whatsapp text-sm"></i> Receipt</button>`
                }
                <button onclick="editStudent(${s.id})" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-medium transition"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteStudent(${s.id})" class="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-2 rounded-lg text-xs font-medium transition"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
        `;
    }).join('');
}

// Generate WhatsApp Message for Pending Fees
function sendWhatsAppReminder(id) {
    const s = students.find(item => item.id === id);
    const msg = `Hello Parent,\n\nThis is a gentle reminder that the fee of *₹${s.amount}* for the month of *${s.month} ${s.year}* for your child *${s.name}* is currently pending.\n\nPlease clear the dues at your earliest convenience.\n\nThank you!`;
    window.open(`https://wa.me/${s.phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

// Generate WhatsApp Message for Paid Receipts
function sendWhatsAppReceipt(id) {
    const s = students.find(item => item.id === id);
    const pDate = s.payment_date ? new Date(s.payment_date).toLocaleDateString() : new Date().toLocaleDateString();
    
    const msg = `Hello Parent,\n\nThank you! We have successfully received the fee payment of *₹${s.amount}* for *${s.month} ${s.year}* for your child *${s.name}* on ${pDate}.\n\nPayment Status: *PAID* ✅\n\nRegards,\nInstitution / Teacher`;
    window.open(`https://wa.me/${s.phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

// Open Modal to Add a New Student
function openAddModal() {
    document.getElementById('modalTitle').innerText = "Add New Student";
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = "";
    
    // Auto-fill today's date into the Date input fields
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('admission_date').value = today;
    document.getElementById('payment_date').value = today;

    document.getElementById('studentModal').classList.remove('hidden');
}

// Open Modal to Edit an Existing Student
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
    document.getElementById('section').value = s.section || "";
    
    // Format dates correctly for the HTML <input type="date"> fields
    document.getElementById('payment_date').value = s.payment_date ? s.payment_date.split('T')[0] : "";
    document.getElementById('admission_date').value = s.admission_date ? s.admission_date.split('T')[0] : "";
    
    document.getElementById('studentModal').classList.remove('hidden');
}

// Close Modal
function closeModal() {
    document.getElementById('studentModal').classList.add('hidden');
}

// Save Data (Add or Edit) to Google Sheets
async function saveStudent(e) {
    e.preventDefault();
    document.getElementById('studentList').innerHTML = `<div class="text-center py-10 text-indigo-500 font-medium animate-pulse">Saving to Google Sheets...</div>`;
    closeModal();
    
    const id = document.getElementById('studentId').value;
    const studentData = {
        id: id ? Number(id) : Date.now(),
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        month: document.getElementById('month').value,
        year: document.getElementById('year').value,
        amount: Number(document.getElementById('amount').value),
        status: document.getElementById('status').value,
        payment_date: document.getElementById('payment_date').value,
        admission_date: document.getElementById('admission_date').value,
        section: document.getElementById('section').value
    };

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'save', student: studentData })
        });
    } catch (error) {
        console.error("Error saving data:", error);
    }
    
    loadData(); // Refresh the list from the sheet after saving
}

// Delete Record from Google Sheets
async function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this record completely from Google Sheets?")) {
        document.getElementById('studentList').innerHTML = `<div class="text-center py-10 text-rose-500 font-medium animate-pulse">Deleting record...</div>`;
        
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'delete', id: id })
            });
        } catch (error) {
            console.error("Error deleting data:", error);
        }
        
        loadData(); // Refresh list after deleting
    }
}

// Run the loadData function immediately when the webpage opens
window.onload = loadData;
