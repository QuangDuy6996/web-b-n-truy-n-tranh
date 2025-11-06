// admin-script.js (refactored & fixed)
// Protect page
const isLoggedIn = localStorage.getItem('adminLoggedIn');
if (isLoggedIn !== 'true') {
    window.location.href = 'login.html';
}

// Sample mock data (same structure as before)
const mockUsers = [
    { id: 201, name: 'Nguyễn Văn A', email: 'vana@example.com', registrationDate: '2025-09-10', status: 'Active' },
    { id: 202, name: 'Trần Thị B', email: 'thib@example.com', registrationDate: '2025-10-05', status: 'Active' },
    { id: 203, name: 'Phạm Văn C', email: 'vanc@example.com', registrationDate: '2025-10-20', status: 'Locked' },
    { id: 204, name: 'Lê Thị D', email: 'thid@example.com', registrationDate: '2025-11-01', status: 'Active' },
];
const statusOptions = ['Đang xử lý', 'Đang giao', 'Đã hoàn thành', 'Đã hủy'];
const mockOrders = [
    { id: 'DH001', customer: 'Nguyễn Văn A', total: 299000, date: '2025-11-01', status: 'Đang xử lý', address: '123 Đường A, Quận 1, TP. HCM' }, 
    { id: 'DH002', customer: 'Trần Thị B', total: 270000, date: '2025-11-01', status: 'Đã hoàn thành', address: '456 Đường B, Quận 2, TP. HCM' },
    { id: 'DH003', customer: 'Phạm Văn C', total: 228000, date: '2025-11-02', status: 'Đang giao', address: '789 Đường C, Quận 3, TP. HCM' },
    { id: 'DH004', customer: 'Lê Thị D', total: 130000, date: '2025-11-02', status: 'Đã hủy', address: '101 Đường D, Quận 4, TP. HCM' },
];
const mockOrderItems = [
    { id: 'DH001', items: [
        { name: 'Frieren - Pháp Sư Tiên Tri Tập 1', price: 99000, quantity: 1, image: 'https://via.placeholder.com/80x120?text=Frieren' },
        { name: 'Quintessential Quintuplets Tập 14', price: 200000, quantity: 1, image: 'https://via.placeholder.com/80x120?text=Quint' }
    ]},
    { id: 'DH002', items: [
        { name: 'Arya Tập 4', price: 90000, quantity: 2, image: 'https://via.placeholder.com/80x120?text=Arya' },
        { name: 'Arya Tập 8', price: 90000, quantity: 1, image: 'https://via.placeholder.com/80x120?text=Arya' }
    ]},
    { id: 'DH003', items: [
        { name: 'Unnamed Memory Tập 1', price: 99000, quantity: 1, image: 'https://via.placeholder.com/80x120?text=UM1' },
        { name: 'Unnamed Memory Tập 2', price: 99000, quantity: 1, image: 'https://via.placeholder.com/80x120?text=UM2' },
        { name: 'One Piece Tập 109', price: 30000, quantity: 1, image: 'https://via.placeholder.com/80x120?text=OP109' }
    ]},
    { id: 'DH004', items: [
        { name: 'Frieren P.S.T. Tập 10', price: 65000, quantity: 1, image: 'https://via.placeholder.com/80x120?text=FPST' },
        { name: 'Frieren P.S.T. Tập 12', price: 65000, quantity: 1, image: 'https://via.placeholder.com/80x120?text=FPST' }
    ]}
];
const mockProducts = [
    { id: 101, name: 'Frieren - Pháp Sư Tiên Tri', author: 'Yamada Kaneto', price: 99000, category: 'Adventure', image: 'https://via.placeholder.com/60x90?text=Frieren', stock: 50 },
    { id: 102, name: 'Romance Thần Tiên', author: 'Kim Đồng', price: 200000, category: 'Romance', image: 'https://via.placeholder.com/60x90?text=Romance', stock: 35 },
    { id: 103, name: 'Dragon Ball Tập 1', author: 'Akira Toriyama', price: 55000, category: 'Adventure', image: 'https://via.placeholder.com/60x90?text=DB', stock: 120 },
];
const mockCategories = ['Adventure', 'Romance', 'School Life', 'Fantasy', 'Horror'];

// Page elements
const mainContent = document.getElementById('main-content');
const pageTitle = document.getElementById('page-title');
const adminNameEl = document.getElementById('admin-name');

// show admin name
const adminName = localStorage.getItem('adminName') || 'Admin';
adminNameEl.textContent = adminName;

// helpers
function renderContent(title, html) {
    pageTitle.textContent = title;
    mainContent.innerHTML = html;
}

function viewOrderDetail(orderId) {
    localStorage.setItem('currentOrderId', orderId);
    window.location.href = 'order_detail.html';
}

// Orders
function renderOrderManagement() {
    let tableRows = mockOrders.map(order => {
        const statusBadge = (status) => {
            let className = '';
            switch (status) {
                case 'Đang xử lý': className = 'bg-warning text-dark'; break;
                case 'Đang giao': className = 'bg-info text-dark'; break;
                case 'Đã hoàn thành': className = 'bg-success'; break;
                case 'Đã hủy': className = 'bg-danger'; break;
                default: className = 'bg-secondary';
            }
            return `<span class="badge ${className}">${status}</span>`;
        };
        const statusSelect = statusOptions.map(option =>
            `<option value="${option}" ${order.status === option ? 'selected' : ''}>${option}</option>`
        ).join('');
        return `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.total.toLocaleString('vi-VN')} VNĐ</td>
                <td>${order.date}</td>
                <td><select class="form-select form-select-sm status-changer" data-order-id="${order.id}">${statusSelect}</select></td>
                <td>${statusBadge(order.status)}</td>
                <td><button class="btn btn-sm btn-outline-primary" data-id="${order.id}" onclick="viewOrderDetail('${order.id}')">Chi tiết</button></td>
            </tr>
        `;
    }).join('');

    const html = `
        <div class="card card-ghost p-3">
            <h3>Quản lý Đơn hàng <i class="fas fa-shopping-cart"></i></h3>
            <p>Tổng: <strong>${mockOrders.length}</strong></p>
            <div class="table-responsive">
                <table class="table table-hover table-bordered">
                    <thead class="table-dark">
                        <tr><th>Mã Đơn</th><th>Khách hàng</th><th>Tổng tiền</th><th>Ngày</th><th>Cập nhật</th><th>Trạng thái</th><th>Hành động</th></tr>
                    </thead>
                    <tbody id="orders-table-body">${tableRows}</tbody>
                </table>
            </div>
        </div>
    `;
    renderContent('Quản lý Đơn hàng', html);
    attachStatusUpdateListeners();
}

function attachStatusUpdateListeners() {
    document.querySelectorAll('.status-changer').forEach(sel => {
        sel.addEventListener('change', function() {
            const orderId = this.dataset.orderId;
            const newStatus = this.value;
            const idx = mockOrders.findIndex(o => o.id === orderId);
            if (idx !== -1) {
                mockOrders[idx].status = newStatus;
                alert(`Đã cập nhật đơn ${orderId} -> ${newStatus}`);
                renderOrderManagement();
            }
        });
    });
}

// Products
function renderProductManagement(productsToDisplay = mockProducts) {
    const categoryOptionsHtml = mockCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    const rows = productsToDisplay.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><img src="${p.image}" style="width:48px;height:72px;object-fit:cover;border-radius:4px"></td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.price.toLocaleString('vi-VN')} VNĐ</td>
            <td>${p.stock}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editProduct(${p.id})">Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">Xóa</button>
            </td>
        </tr>
    `).join('');
    const html = `
        <div class="card card-ghost p-3">
            <h3>Quản lý Truyện <i class="fas fa-book"></i></h3>
            <div class="row mb-2">
                <div class="col-md-6"><input id="product-search" onkeyup="filterProducts()" class="form-control" placeholder="Tìm kiếm tên hoặc ID..."></div>
                <div class="col-md-4"><select id="category-filter" class="form-select" onchange="filterProducts()"><option value="">-- Lọc thể loại --</option>${categoryOptionsHtml}</select></div>
                <div class="col-md-2 text-end"><small class="text-muted">Tìm thấy: ${productsToDisplay.length}</small></div>
            </div>
            <div class="table-responsive">
                <table class="table table-hover table-bordered">
                    <thead class="table-dark"><tr><th>ID</th><th>Ảnh</th><th>Tên</th><th>Thể loại</th><th>Giá</th><th>Tồn kho</th><th>Hành động</th></tr></thead>
                    <tbody>${rows || '<tr><td colspan="7" class="text-center">Không có truyện</td></tr>'}</tbody>
                </table>
            </div>
        </div>
    `;
    renderContent('Quản lý Truyện', html);
}

function filterProducts() {
    const q = (document.getElementById('product-search')?.value || '').toLowerCase();
    const cat = (document.getElementById('category-filter')?.value || '');
    const filtered = mockProducts.filter(p => (p.name.toLowerCase().includes(q) || String(p.id).includes(q)) && (cat === '' || p.category === cat));
    renderProductManagement(filtered);
}

function deleteProduct(id) {
    if (!confirm('Bạn có chắc muốn xóa?')) return;
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx !== -1) {
        mockProducts.splice(idx,1);
        alert('Đã xóa');
        renderProductManagement();
    }
}

function showProductForm(mode='add', id=null) {
    let product = {};
    let title = 'Thêm Truyện Mới';
    if (mode === 'edit' && id !== null) {
        product = mockProducts.find(p => p.id === id) || {};
        title = 'Sửa Truyện';
    }
    const categoryOptionsHtml = mockCategories.map(cat => `<option ${product.category===cat?'selected':''} value="${cat}">${cat}</option>`).join('');
    const html = `
        <div class="card card-ghost p-3">
            <h3>${title}</h3>
            <button class="btn btn-secondary mb-3" onclick="renderProductManagement()">Quay lại</button>
            <form onsubmit="event.preventDefault(); ${mode==='add'?'addProduct()':'saveEditProduct('+id+')'}">
                <div class="row">
                    <div class="col-md-6"><div class="mb-2"><label>Tên</label><input id="name" class="form-control" value="${product.name||''}" required></div>
                    <div class="mb-2"><label>Tác giả</label><input id="author" class="form-control" value="${product.author||''}"></div>
                    <div class="mb-2"><label>Giá</label><input id="price" type="number" class="form-control" value="${product.price||0}" required></div></div>
                    <div class="col-md-6"><div class="mb-2"><label>Thể loại</label><select id="category" class="form-select" required><option value="">--Chọn--</option>${categoryOptionsHtml}</select></div>
                    <div class="mb-2"><label>Tồn kho</label><input id="stock" type="number" class="form-control" value="${product.stock||0}" required></div>
                    <div class="mb-2"><label>Ảnh (URL)</label><input id="image" class="form-control" value="${product.image||''}"></div></div>
                </div>
                <button class="btn btn-primary w-100 mt-2">${mode==='add'?'Thêm':'Lưu'}</button>
            </form>
        </div>
    `;
    renderContent(title, html);
}

function addProduct() {
    const newId = Math.max(...mockProducts.map(p=>p.id)) + 1;
    const p = {
        id: newId,
        name: document.getElementById('name').value,
        author: document.getElementById('author').value,
        price: parseInt(document.getElementById('price').value),
        category: document.getElementById('category').value,
        stock: parseInt(document.getElementById('stock').value),
        image: document.getElementById('image').value || 'https://via.placeholder.com/60x90?text=NoImage'
    };
    mockProducts.push(p);
    alert('Đã thêm truyện');
    renderProductManagement();
}

function saveEditProduct(id) {
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx===-1) return;
    mockProducts[idx].name = document.getElementById('name').value;
    mockProducts[idx].author = document.getElementById('author').value;
    mockProducts[idx].price = parseInt(document.getElementById('price').value);
    mockProducts[idx].category = document.getElementById('category').value;
    mockProducts[idx].stock = parseInt(document.getElementById('stock').value);
    mockProducts[idx].image = document.getElementById('image').value || mockProducts[idx].image;
    alert('Đã lưu thay đổi');
    renderProductManagement();
}

function editProduct(id) { showProductForm('edit', id); }

// Users
function renderUserManagement() {
    const rows = mockUsers.map(u => {
        const locked = u.status === 'Locked';
        return `<tr>
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td>${u.registrationDate}</td>
            <td>${locked?'<span class="badge bg-danger">Khóa</span>':'<span class="badge bg-success">Hoạt động</span>'}</td>
            <td>${locked?'<button class="btn btn-sm btn-success" onclick="toggleUserStatus('+u.id+',\'Active\')">Mở khóa</button>':'<button class="btn btn-sm btn-danger" onclick="toggleUserStatus('+u.id+',\'Locked\')">Khóa</button>'}</td>
        </tr>`}).join('');
    const html = `<div class="card card-ghost p-3"><h3>Quản lý Người dùng <i class="fas fa-users"></i></h3><p>Tổng: <strong>${mockUsers.length}</strong></p><div class="table-responsive"><table class="table table-hover table-bordered"><thead class="table-dark"><tr><th>ID</th><th>Tên</th><th>Email</th><th>Ngày</th><th>Trạng thái</th><th>Hành động</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
    renderContent('Quản lý Người dùng', html);
}

function toggleUserStatus(id, newStatus) {
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx!==-1) {
        mockUsers[idx].status = newStatus;
        alert('Đã cập nhật trạng thái');
        renderUserManagement();
    }
}

// Sidebar navigation
document.getElementById('nav-dashboard').addEventListener('click', (e)=>{e.preventDefault(); renderDashboard(); setActiveNav('nav-dashboard');});
document.getElementById('nav-orders').addEventListener('click', (e)=>{e.preventDefault(); renderOrderManagement(); setActiveNav('nav-orders');});
document.getElementById('nav-products').addEventListener('click', (e)=>{e.preventDefault(); renderProductManagement(); setActiveNav('nav-products');});
document.getElementById('nav-users').addEventListener('click', (e)=>{e.preventDefault(); renderUserManagement(); setActiveNav('nav-users');});

function setActiveNav(id) {
    document.querySelectorAll('#sidebar .nav-link').forEach(a=>a.classList.remove('active'));
    const el = document.getElementById(id);
    if(el) el.classList.add('active');
}

// Dashboard
function renderDashboard() {
    const totalOrders = mockOrders.length;
    const completed = mockOrders.filter(o=>o.status==='Đã hoàn thành').length;
    const revenue = mockOrders.filter(o=>o.status==='Đã hoàn thành').reduce((s,o)=>s+o.total,0);
    const html = `<div class="row g-3">
        <div class="col-md-4"><div class="card card-ghost p-3"><h6>Tổng Đơn</h6><div class="h3">${totalOrders}</div></div></div>
        <div class="col-md-4"><div class="card card-ghost p-3"><h6>Hoàn thành</h6><div class="h3">${completed}</div></div></div>
        <div class="col-md-4"><div class="card card-ghost p-3"><h6>Doanh thu (Hoàn thành)</h6><div class="h3">${revenue.toLocaleString('vi-VN')} VNĐ</div></div></div>
    </div><div class="mt-3 alert alert-info">Sử dụng thanh bên để điều hướng.</div>`;
    renderContent('Dashboard', html);
}

// Logout
document.getElementById('logout-btn').addEventListener('click', ()=>{ localStorage.removeItem('adminLoggedIn'); localStorage.removeItem('adminName'); window.location.href='login.html'; });

// On load
window.addEventListener('load', ()=>{ renderDashboard(); });
