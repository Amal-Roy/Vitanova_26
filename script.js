// ===== GLOBAL VARIABLES =====
let scene, camera, renderer, controls;
let ministryData = {};
let currentPage = 'home';
let isAdminLoggedIn = false;
let navigationHistory = [];

// ===== MINISTRY DATA =====
const ministriesList = [
    { id: 'general', name: 'General Team', icon: '👥', description: 'Overall coordination and program management' },
    { id: 'program', name: 'Program Team', icon: '📋', description: 'Event scheduling and program structure' },
    { id: 'mobilization', name: 'Mobilization Team', icon: '🚀', description: 'Outreach and participant engagement' },
    { id: 'intercession', name: 'Intercession Ministry', icon: '🙏', description: 'Prayer support and spiritual guidance' },
    { id: 'media', name: 'Media Team', icon: '📷', description: 'Photography, videography, and content creation' },
    { id: 'volunteers', name: 'Volunteers Team', icon: '🤝', description: 'Volunteer coordination and management' },
    { id: 'finance', name: 'Finance Team', icon: '💰', description: 'Budget management and financial oversight' },
    { id: 'local-arrangement', name: 'Local Arrangement Team', icon: '🏛️', description: 'Venue and logistics coordination' },
    { id: 'security', name: 'Security Team', icon: '🛡️', description: 'Safety and security management' },
    { id: 'theatre', name: 'Theatre Ministry', icon: '🎭', description: 'Dramatic performances and presentations' },
    { id: 'food', name: 'Food Ministry', icon: '🍽️', description: 'Catering and meal arrangements' },
    { id: 'resource-caring', name: 'Resource Caring Team', icon: '📦', description: 'Resource management and distribution' },
    { id: 'liturgy', name: 'Liturgy Team', icon: '⛪', description: 'Worship services and liturgical elements' },
    { id: 'confession', name: 'Confession,Counseling Team', icon: '💒', description: 'Sacramental confession support' },
    { id: 'counseling', name: 'Av Ministry', icon: '🔊📽️', description: 'Personal counseling and support' },
    { id: 'decoration', name: 'Arts Ministry', icon: '🎨', description: 'Visual design and venue decoration' },
    { id: 'music', name: 'Music Ministry', icon: '🎵', description: 'Musical performances and sound management' }
];
// ===== EDIT NAMES HERE ONLY =====

// TOTAL NAMES REQUIRED:
// 17 ministries × (1 Coordinator + 1 Assistant + 15 Members) = 289 names

const PEOPLE_NAMES = [
    "Bryan Maria Roy", "Amal Roy", "Dony Simon", "Sneha Anna Jacob",
    "Dario George", "Sr.Lissa", "Rosemary mathew", "Angeleena Binoy",
    "Raisy", "Jismon K Baby", "","","","","","","","Sneha Anna","Alent Siby","Joshna Jojo","Tiya","","","","","","","","","","","","","","Kevin Geo Saji","Sona Sunny",
    "Eilin","Christy Bobby","Judit Jeby","Angelina Rose","Alen Joji","Arpitha Bose","","","","","","","","","","Rosemary","Dario","Ash","Jovan","Sibin","Aksa Vinod","",
    "","","","","","","","","","","Austin","Nithin","Joel Williams",
    "Joshua","Ashik Sibi","Ann Maria Jaison","","","","","","","", "","","","","Jismon","Ashly Vinod", "","","","","","","", "","","","","","","", "","Angeleena","Riya",
    "Alvia","Angel Fernandes","Catherine Susan","Noel Mathew","Alan GEO Shaji","Godwin" ,"Adina Joby ","Christeena John","","","","","","","","Melvin Saji","Nithin","","",
    "","","","","","","","","","","","","","Deon","","Elisha Anto","Athul George","","","","","","","","","","","","","",,"","","","","","","","","","","","","",
    "","","","Jose","","Alan Manu","Lewin Sha Jose","","","","","","","","","","","","","","Sona Mary","","Merin Joji","Agnus Christopher","Jubel","","","","","","","","","","","","","Sr Lisa",
    ,"Anuya Rajeev","Jacob Thomas","Albin brother","","","","","","","","","","","","","Sr Lisa","","Anuya Rajeev","Jacob Thomas","Albin brother","","","","","","","","","","","",
    "","Sona Sunny","Lisa Maria Philip","Alwin L","Anto","Jacob Gigi","Maria Elsa Abraham",
    "Ruben","Abraham Dani","","","","","","","","","","Anna Babu","Alwin C J","Alanteena","Annitmaria","Ashlin","Feba","Layana","Neha Rose","Aleena Santhosh","Angel","Richu","Elna",
    "Neha Joshy","","","","","Mannah","Angeleena","Dan","Ann Maria Thankachan","Alan GEO Shaji BHM","Alphonse","Raphel","Tiya"

    // 👆 ADD ALL 289 UNIQUE NAMES HERE
];

// This index will auto-increment safely
let nameIndex = 0;

// Helper to get next unique name
function getNextName() {
    if (nameIndex >= PEOPLE_NAMES.length) {
        return "Name Missing";
    }
    return PEOPLE_NAMES[nameIndex++];
}


// Initialize ministry data with sample members
function initializeMinistryData() {
    ministriesList.forEach((ministry, index) => {
        const firstLetter = ministry.name.charAt(0);
        ministryData[ministry.id] = {
            ...ministry,
          coordinator: {
    name: getNextName(),   // ✅ REAL NAME
    photo: firstLetter,
    role: 'Coordinator'
},
assistantCoordinator: {
    name: getNextName(),   // ✅ REAL NAME
    photo: firstLetter,
    role: 'Assistant Coordinator'
},
members: generateTeamMembers(ministry, 15)

        };
    });
}

function generateTeamMembers(ministry, count) {
    
    const responsibilities = [
        'Event Coordination', 'Logistics Management', 'Team Communication',
        'Resource Allocation', 'Quality Control', 'Participant Engagement',
        'Documentation', 'Technical Support', 'Content Creation',
        'Schedule Management', 'Venue Setup', 'Safety Protocols',
        'Public Relations', 'Data Management', 'Volunteer Training'
    ];
    
    const members = [];
    for (let i = 1; i <= count; i++) {
        members.push({
            id: `${ministry.id}-member-${i}`,
name: getNextName(),   // ✅ REAL NAME
            photo: ministry.name.charAt(0),
            responsibility: responsibilities[(i - 1) % responsibilities.length],
            role: 'Team Member',
            ministry: ministry.id,
            dailyAssignments: [`Assignment ${i} for ${ministry.name}`, `Task ${i}: Coordination duties`]
        });
    }
    return members;
}

// ===== THREE.JS 3D SCENE =====
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;
    camera.position.y = 2;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0x6366f1, 1);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xec4899, 0.8);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    // Create floating 3D cards
    createFloatingCards();

    // Animation loop
    animate();
}

function createFloatingCards() {
    const cardGeometry = new THREE.BoxGeometry(1.5, 2, 0.1);
    const cardMaterial = new THREE.MeshPhongMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.7,
        shininess: 100
    });

    for (let i = 0; i < 8; i++) {
        const card = new THREE.Mesh(cardGeometry, cardMaterial.clone());
        const angle = (i / 8) * Math.PI * 2;
        const radius = 3;
        card.position.x = Math.cos(angle) * radius;
        card.position.y = Math.sin(angle * 2) * 1.5;
        card.position.z = Math.sin(angle) * radius;
        card.rotation.y = angle;
        card.userData = {
            initialY: card.position.y,
            angle: angle,
            speed: 0.01 + Math.random() * 0.02
        };
        scene.add(card);
    }
}

function animate() {
    if (!scene) return;
    
    requestAnimationFrame(animate);

    // Animate cards
    scene.children.forEach(child => {
        if (child.userData && child.userData.initialY !== undefined) {
            child.rotation.y += 0.01;
            child.position.y = child.userData.initialY + Math.sin(Date.now() * child.userData.speed) * 0.5;
        }
    });

    // Camera rotation
    if (camera) {
        const time = Date.now() * 0.0005;
        camera.position.x = Math.sin(time) * 0.5;
        camera.lookAt(0, 0, 0);
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// ===== PAGE NAVIGATION =====
function navigateTo(pageId) {
    navigationHistory.push(currentPage);
    showPage(pageId);
    updateNavLinks(pageId);
}

function goBack() {
    if (navigationHistory.length > 0) {
        const previousPage = navigationHistory.pop();
        showPage(previousPage);
        updateNavLinks(previousPage);
    } else {
        navigateTo('home');
    }
}

function showPage(pageId) {
    currentPage = pageId;
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Load content based on page
        switch(pageId) {
            case 'ministries':
                loadMinistriesPage();
                break;
            case 'updates':
                loadUpdatesPage();
                break;
            case 'admin':
                if (!isAdminLoggedIn) {
                    showAdminLogin();
                }
                break;
        }
    }
}

function updateNavLinks(activePage) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activePage}`) {
            link.classList.add('active');
        }
    });
}

// Navigation link clicks
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute('href').substring(1);
        navigateTo(targetPage);
    });
});

// ===== MINISTRIES PAGE =====
function loadMinistriesPage() {
    const grid = document.getElementById('ministries-grid');
    if (!grid) return;

    grid.innerHTML = '';
    ministriesList.forEach(ministry => {
        const card = document.createElement('div');
        card.className = 'ministry-card';
        card.innerHTML = `
            <div class="ministry-icon">${ministry.icon}</div>
            <h3>${ministry.name}</h3>
            <p>${ministry.description}</p>
        `;
        card.addEventListener('click', () => showMinistryDetail(ministry.id));
        grid.appendChild(card);
    });
}

function showMinistryDetail(ministryId) {
    const ministry = ministryData[ministryId];
    if (!ministry) return;

    const container = document.getElementById('ministry-detail-container');
    if (!container) return;

    container.innerHTML = `
        <div class="ministry-header">
            <h1>${ministry.icon} ${ministry.name}</h1>
            <p class="ministry-description">${ministry.description}</p>
        </div>

        <div class="leadership-section">
            <h2 class="section-title">Leadership</h2>
            <div class="leadership-grid">
                <div class="leader-card">
                    <div class="leader-photo">${ministry.coordinator.photo}</div>
                    <h3 class="leader-name">${ministry.coordinator.name}</h3>
                    <p class="leader-role">${ministry.coordinator.role}</p>
                    <p class="leader-contact">${ministry.coordinator.contact}</p>
                </div>
                <div class="leader-card">
                    <div class="leader-photo">${ministry.assistantCoordinator.photo}</div>
                    <h3 class="leader-name">${ministry.assistantCoordinator.name}</h3>
                    <p class="leader-role">${ministry.assistantCoordinator.role}</p>
                    <p class="leader-contact">${ministry.assistantCoordinator.contact}</p>
                </div>
            </div>
        </div>

        <div class="team-section">
            <h2 class="section-title">Team Members</h2>
            <div class="team-controls">
                <input type="text" id="member-search" placeholder="Search by name..." oninput="filterMembers('${ministryId}')">
                <select id="role-filter" onchange="filterMembers('${ministryId}')">
                    <option value="all">All Roles</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="assistant">Assistant Coordinator</option>
                    <option value="member">Team Member</option>
                </select>
            </div>
            <div class="team-members-grid" id="team-members-grid-${ministryId}">
                ${ministry.members.map(member => `
                    <div class="member-card" onclick="showPersonProfile('${member.id}')">
                        <div class="member-photo">${member.photo}</div>
                        <h4 class="member-name">${member.name}</h4>
                        <p class="member-role">${member.responsibility}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    navigateTo('ministry-detail');
}

function filterMembers(ministryId) {
    const searchTerm = document.getElementById('member-search').value.toLowerCase();
    const roleFilter = document.getElementById('role-filter').value;
    const ministry = ministryData[ministryId];
    const grid = document.getElementById(`team-members-grid-${ministryId}`);
    
    if (!grid || !ministry) return;

    let filtered = ministry.members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm);
        const matchesRole = roleFilter === 'all' || 
            (roleFilter === 'member' && member.role === 'Team Member') ||
            (roleFilter === 'coordinator' && member.role === 'Coordinator') ||
            (roleFilter === 'assistant' && member.role === 'Assistant Coordinator');
        return matchesSearch && matchesRole;
    });

    // Add coordinator and assistant coordinator to filtered results if they match
    if (roleFilter === 'all' || roleFilter === 'coordinator') {
        if (ministry.coordinator.name.toLowerCase().includes(searchTerm)) {
            filtered.unshift({...ministry.coordinator, id: `${ministryId}-coordinator`});
        }
    }
    if (roleFilter === 'all' || roleFilter === 'assistant') {
        if (ministry.assistantCoordinator.name.toLowerCase().includes(searchTerm)) {
            filtered.unshift({...ministry.assistantCoordinator, id: `${ministryId}-assistant`});
        }
    }

    grid.innerHTML = filtered.map(member => {
        const photo = member.photo || ministry.name.charAt(0);
        return `
            <div class="member-card" onclick="showPersonProfile('${member.id}')">
                <div class="member-photo">${photo}</div>
                <h4 class="member-name">${member.name}</h4>
                <p class="member-role">${member.responsibility || member.role}</p>
            </div>
        `;
    }).join('');
}

// ===== PERSON PROFILE =====
function showPersonProfile(personId) {
    let person = null;
    let ministryName = '';

    // Search for person in all ministries
    for (const ministryId in ministryData) {
        const ministry = ministryData[ministryId];
        if (personId === `${ministryId}-coordinator`) {
            person = {...ministry.coordinator, ministry: ministryId, responsibility: 'Overall coordination and leadership'};
            ministryName = ministry.name;
            break;
        } else if (personId === `${ministryId}-assistant`) {
            person = {...ministry.assistantCoordinator, ministry: ministryId, responsibility: 'Supporting coordination and management'};
            ministryName = ministry.name;
            break;
        } else {
            const member = ministry.members.find(m => m.id === personId);
            if (member) {
                person = member;
                ministryName = ministry.name;
                break;
            }
        }
    }

    if (!person) return;

    const container = document.getElementById('person-profile-container');
    if (!container) return;

    container.innerHTML = `
        <div class="person-profile-header">
            <div class="person-profile-photo">${person.photo}</div>
            <h1 class="person-profile-name">${person.name}</h1>
            <p class="person-profile-ministry">${ministryName}</p>
            <p class="person-profile-role">${person.role}</p>
        </div>

        <div class="person-details">
            <div class="detail-item">
                <h3>Role & Responsibilities</h3>
                <p>${person.responsibility || 'Key team member responsible for ministry operations and coordination.'}</p>
            </div>
            ${person.contact ? `
            <div class="detail-item">
                <h3>Contact Information</h3>
                <p>Email: ${person.contact}</p>
            </div>
            ` : ''}
            ${person.dailyAssignments ? `
            <div class="detail-item">
                <h3>Daily Assignments</h3>
                <ul class="daily-assignments">
                    ${person.dailyAssignments.map(assignment => `<li>${assignment}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </div>
    `;

    navigateTo('person-profile');
}

// ===== UPDATES PAGE =====
let dailyUpdates = [
    {
        id: 1,
        date: '2026-1-20',
        title: 'Online-Consultant Meeting',
        content: '“A consultation meeting involving three ministries will take place.”',
        ministry: 'Mobilization,Intercession,Media',
        priority: 'normal'
    },
    {
        id: 2,
        date: '',
        title: 'Volunteers Training',
        content: '“Volunteers training will take place at the end of the month. The day will also include an anointing for the volunteers as they prepare for their ministry service.” ',
        ministry: 'For all ministries',
        priority: 'emergency'
    },
    
];

function loadUpdatesPage() {
    const timeline = document.getElementById('updates-timeline');
    if (!timeline) return;

    timeline.innerHTML = dailyUpdates.map(update => `
        <div class="update-card">
            <div class="update-date">${formatDate(update.date)}</div>
            <h3 class="update-title">${update.title}</h3>
            <p class="update-content">${update.content}</p>
            <div>
                <span class="update-ministry">${update.ministry}</span>
                <span class="update-priority ${update.priority}">${update.priority === 'emergency' ? '🚨 Emergency' : '📢 Announcement'}</span>
            </div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// ===== ADMIN PANEL =====
function showAdminLogin() {
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
}

document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    // Simple authentication (in production, use secure authentication)
    if (username === 'admin' && password === 'admin123') {
        isAdminLoggedIn = true;
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        showAdminTab('ministries');
    } else {
        alert('Invalid credentials. Use: admin / admin123');
    }
});

function showAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    const content = document.getElementById('admin-content');
    if (!content) return;

    switch(tab) {
        case 'ministries':
            content.innerHTML = `
                <h3>Manage Ministries</h3>
                <p>Select a ministry to edit:</p>
                <div class="admin-ministries-list">
                    ${ministriesList.map(ministry => `
                        <div class="admin-item" onclick="editMinistry('${ministry.id}')">
                            <span>${ministry.icon} ${ministry.name}</span>
                            <button>Edit</button>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
        case 'updates':
            content.innerHTML = `
                <h3>Manage Daily Updates</h3>
                <button class="admin-btn" onclick="addUpdate()">Add New Update</button>
                <div class="admin-updates-list">
                    ${dailyUpdates.map(update => `
                        <div class="admin-item">
                            <div>
                                <strong>${update.title}</strong>
                                <p>${update.content}</p>
                                <small>${formatDate(update.date)} - ${update.ministry}</small>
                            </div>
                            <button onclick="deleteUpdate(${update.id})">Delete</button>
                        </div>
                    `).join('')}
                </div>
            `;
            break;
        case 'members':
            content.innerHTML = `
                <h3>Manage Team Members</h3>
                <p>Use the ministry edit function to manage members for each ministry.</p>
                <p>Total Ministries: ${ministriesList.length}</p>
                <p>Total Members: ${Object.values(ministryData).reduce((sum, m) => sum + m.members.length, 0)}</p>
            `;
            break;
    }
}

function editMinistry(ministryId) {
    const ministry = ministryData[ministryId];
    const content = document.getElementById('admin-content');
    content.innerHTML = `
        <h3>Edit ${ministry.name}</h3>
        <button class="admin-btn" onclick="showAdminTab('ministries')">← Back</button>
        <div class="edit-form">
            <h4>Ministry Information</h4>
            <input type="text" id="edit-name" value="${ministry.name}" placeholder="Ministry Name">
            <textarea id="edit-description" placeholder="Description">${ministry.description}</textarea>
            
            <h4>Coordinator</h4>
            <input type="text" id="edit-coord-name" value="${ministry.coordinator.name}" placeholder="Coordinator Name">
            <input type="email" id="edit-coord-email" value="${ministry.coordinator.contact}" placeholder="Email">
            
            <h4>Assistant Coordinator</h4>
            <input type="text" id="edit-assist-name" value="${ministry.assistantCoordinator.name}" placeholder="Assistant Name">
            <input type="email" id="edit-assist-email" value="${ministry.assistantCoordinator.contact}" placeholder="Email">
            
            <button class="admin-btn" onclick="saveMinistry('${ministryId}')">Save Changes</button>
        </div>
    `;
}

function saveMinistry(ministryId) {
    const ministry = ministryData[ministryId];
    ministry.name = document.getElementById('edit-name').value;
    ministry.description = document.getElementById('edit-description').value;
    ministry.coordinator.name = document.getElementById('edit-coord-name').value;
    ministry.coordinator.contact = document.getElementById('edit-coord-email').value;
    ministry.assistantCoordinator.name = document.getElementById('edit-assist-name').value;
    ministry.assistantCoordinator.contact = document.getElementById('edit-assist-email').value;
    
    alert('Ministry updated successfully!');
    showAdminTab('ministries');
}

function addUpdate() {
    const date = new Date().toISOString().split('T')[0];
    const title = prompt('Update Title:');
    if (!title) return;
    const content = prompt('Update Content:');
    if (!content) return;
    const ministry = prompt('Ministry (e.g., General Team):') || 'General Team';
    const priority = confirm('Is this an emergency?') ? 'emergency' : 'normal';
    
    const newUpdate = {
        id: dailyUpdates.length + 1,
        date: date,
        title: title,
        content: content,
        ministry: ministry,
        priority: priority
    };
    
    dailyUpdates.unshift(newUpdate);
    showAdminTab('updates');
}

function deleteUpdate(updateId) {
    if (confirm('Are you sure you want to delete this update?')) {
        dailyUpdates = dailyUpdates.filter(u => u.id !== updateId);
        showAdminTab('updates');
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeMinistryData();
    initThreeJS();
    loadMinistriesPage();
    loadUpdatesPage();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Make functions globally available
window.navigateTo = navigateTo;
window.goBack = goBack;
window.showMinistryDetail = showMinistryDetail;
window.filterMembers = filterMembers;
window.showPersonProfile = showPersonProfile;
window.showAdminTab = showAdminTab;
window.editMinistry = editMinistry;
window.saveMinistry = saveMinistry;
window.addUpdate = addUpdate;
window.deleteUpdate = deleteUpdate;
