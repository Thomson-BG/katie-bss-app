// Katie BSS App - JavaScript Functionality
class BSSApp {
    constructor() {
        this.currentView = 'dashboard';
        this.currentStudent = null;
        this.isDarkMode = false;
        this.students = [];
        this.interactions = [];
        this.supportPlans = [];
        this.documents = [];
        
        this.initSplashScreen();
        this.init();
    }

    initSplashScreen() {
        // Set up splash screen functionality
        setTimeout(() => {
            // Play collision sound and flash effect
            this.playCollisionEffect();
        }, 2500); // Play sound when letters should collide

        // Show logo after flash effect
        setTimeout(() => {
            const splashLogo = document.getElementById('splashLogo');
            if (splashLogo) {
                splashLogo.classList.remove('hidden');
            }
        }, 2800);

        // Show text after collision
        setTimeout(() => {
            const splashText = document.getElementById('splashText');
            if (splashText) {
                splashText.classList.remove('hidden');
            }
        }, 6000);

        // Remove splash screen
        setTimeout(() => {
            const splashScreen = document.getElementById('splashScreen');
            if (splashScreen) {
                splashScreen.classList.add('hidden');
            }
        }, 10000);
    }

    playCollisionEffect() {
        const splashScreen = document.getElementById('splashScreen');
        const collisionSound = document.getElementById('collisionSound');
        
        // Play sound
        if (collisionSound) {
            collisionSound.currentTime = 0;
            collisionSound.volume = 0.3;
            collisionSound.play().catch(e => console.log('Audio play failed:', e));
        }

        // Flash effect
        if (splashScreen) {
            splashScreen.style.animation = 'flash 0.3s ease-in-out';
            setTimeout(() => {
                splashScreen.style.animation = 'splashFadeOut 1s ease-in-out 6.5s forwards';
            }, 300);
        }
    }

    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.setupDarkMode();
        this.populateInitialData();
        this.renderCurrentView();
        this.updateStats();
    }

    // Local Storage Management
    loadFromLocalStorage() {
        try {
            this.students = JSON.parse(localStorage.getItem('bss_students') || '[]');
            this.interactions = JSON.parse(localStorage.getItem('bss_interactions') || '[]');
            this.supportPlans = JSON.parse(localStorage.getItem('bss_support_plans') || '[]');
            this.documents = JSON.parse(localStorage.getItem('bss_documents') || '[]');
            this.isDarkMode = JSON.parse(localStorage.getItem('bss_dark_mode') || 'false');
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            this.initializeDefaultData();
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('bss_students', JSON.stringify(this.students));
            localStorage.setItem('bss_interactions', JSON.stringify(this.interactions));
            localStorage.setItem('bss_support_plans', JSON.stringify(this.supportPlans));
            localStorage.setItem('bss_documents', JSON.stringify(this.documents));
            localStorage.setItem('bss_dark_mode', JSON.stringify(this.isDarkMode));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            this.showAlert('Error saving data. Please try again.', 'error');
        }
    }

    // Initialize with sample data if empty
    initializeDefaultData() {
        if (this.students.length === 0) {
            this.students = [
                {
                    id: '1234567',
                    name: 'Ethan Carter',
                    grade: '10',
                    profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvd3NYCHCsTiAmCgmcIp8I9DzsYpCqfq_ENSArdjh7wTIWIPIyTKmZrppWHSEc4ratCk0pZu0SMrLhL8VyLAWOjP_50TOWXPasayP-5X5pXCbESX0MvVkzJTnX5wTZK580t6boo8fuR-o9Fsi3RSA654XTLqX4-4TCluT9yztE6U-yfIcTVQJe-4gdNbWLdX0jg6TD31XLk74HonU8Zxzju1yrC4BhcxeRtpb_v02dxjswfCH-qKdVki9P0je7PTA0Zw66FKdxjZSi',
                    createdAt: new Date().toISOString()
                },
                {
                    id: '1234568',
                    name: 'Sarah Johnson',
                    grade: '9',
                    profileImage: null,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '1234569',
                    name: 'Marcus Williams',
                    grade: '11',
                    profileImage: null,
                    createdAt: new Date().toISOString()
                }
            ];
        }

        if (this.interactions.length === 0) {
            this.interactions = [
                {
                    id: Date.now().toString(),
                    studentId: '1234567',
                    type: 'behavioral-incident',
                    date: '2024-07-26',
                    notes: 'Student had difficulty focusing during math class. Implemented breathing exercises.',
                    createdAt: new Date().toISOString()
                },
                {
                    id: (Date.now() - 1000).toString(),
                    studentId: '1234567',
                    type: 'counseling-session',
                    date: '2024-07-20',
                    notes: 'Productive session discussing coping strategies for stress management.',
                    createdAt: new Date().toISOString()
                },
                {
                    id: (Date.now() - 2000).toString(),
                    studentId: '1234567',
                    type: 'parent-meeting',
                    date: '2024-07-15',
                    notes: 'Met with parents to discuss progress and home support strategies.',
                    createdAt: new Date().toISOString()
                }
            ];
        }

        this.saveToLocalStorage();
    }

    populateInitialData() {
        if (this.students.length === 0 && this.interactions.length === 0) {
            this.initializeDefaultData();
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.getAttribute('data-view');
                this.navigateTo(view);
            });
        });

        // Header buttons
        document.getElementById('backBtn').addEventListener('click', () => {
            if (this.currentView === 'studentProfile') {
                this.navigateTo('students');
            } else {
                this.navigateTo('dashboard');
            }
        });

        document.getElementById('addBtn').addEventListener('click', () => {
            this.handleAddButtonClick();
        });

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.showExportModal();
            });
        }

        // Search functionality
        const searchInput = document.getElementById('studentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterStudents(e.target.value);
            });
        }

        // Global search functionality
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => {
                this.performGlobalSearch(e.target.value);
            });
        }

        // Form submissions
        this.setupFormListeners();

        // Modal controls
        this.setupModalListeners();
    }

    setupFormListeners() {
        // Add student form
        const addStudentForm = document.getElementById('addStudentForm');
        if (addStudentForm) {
            addStudentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addStudent();
            });
        }

        // Interaction form
        const interactionForm = document.getElementById('interactionForm');
        if (interactionForm) {
            interactionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addInteraction();
            });
        }

        // Cancel buttons
        document.getElementById('cancelInteraction')?.addEventListener('click', () => {
            this.navigateTo('dashboard');
        });
    }

    setupModalListeners() {
        // Add student modal
        document.getElementById('cancelAddStudent')?.addEventListener('click', () => {
            this.hideModal('addStudentModal');
        });

        // Close modal when clicking outside
        document.getElementById('addStudentModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'addStudentModal') {
                this.hideModal('addStudentModal');
            }
        });
    }

    // Dark Mode
    setupDarkMode() {
        const toggle = document.getElementById('darkModeToggle');
        const sunIcon = document.getElementById('sunIcon');
        const moonIcon = document.getElementById('moonIcon');

        if (this.isDarkMode) {
            document.documentElement.classList.add('dark');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }

        toggle.addEventListener('click', () => {
            this.isDarkMode = !this.isDarkMode;
            document.documentElement.classList.toggle('dark');
            
            if (this.isDarkMode) {
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            } else {
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            }
            
            this.saveToLocalStorage();
        });
    }

    // Navigation
    navigateTo(view) {
        // Hide all views
        document.querySelectorAll('.page-view').forEach(el => {
            el.classList.add('hidden');
        });

        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected view
        const viewElement = document.getElementById(`${view}View`);
        if (viewElement) {
            viewElement.classList.remove('hidden');
        }

        // Update active navigation
        const activeNavBtn = document.querySelector(`[data-view="${view}"]`);
        if (activeNavBtn) {
            activeNavBtn.classList.add('active');
        }

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            students: 'Students',
            studentProfile: 'Student Profile',
            logInteraction: 'Log Interaction',
            reports: 'Reports'
        };

        const pageTitle = document.getElementById('pageTitle');
        if (view === 'dashboard') {
            pageTitle.textContent = "Katie's BSS";
        } else {
            pageTitle.textContent = titles[view] || 'Dashboard';
        }
        this.currentView = view;

        // Show/hide back button based on view
        const backBtn = document.getElementById('backBtn');
        if (view === 'dashboard') {
            backBtn.style.visibility = 'hidden';
        } else {
            backBtn.style.visibility = 'visible';
        }

        // Show/hide add button based on view
        const addBtn = document.getElementById('addBtn');
        if (view === 'reports') {
            addBtn.style.display = 'none';
        } else {
            addBtn.style.display = 'flex';
        }

        // Render view-specific content
        this.renderCurrentView();
    }

    renderCurrentView() {
        switch (this.currentView) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'students':
                this.renderStudents();
                break;
            case 'studentProfile':
                this.renderStudentProfile();
                break;
            case 'logInteraction':
                this.renderLogInteraction();
                break;
            case 'reports':
                this.renderReports();
                break;
        }
    }

    // Dashboard
    renderDashboard() {
        this.updateStats();
        this.renderRecentActivity();
    }

    updateStats() {
        const totalStudentsEl = document.getElementById('totalStudents');
        const activePlansEl = document.getElementById('activePlans');
        const recentInteractionsEl = document.getElementById('recentInteractions');

        if (totalStudentsEl) totalStudentsEl.textContent = this.students.length;
        if (activePlansEl) activePlansEl.textContent = this.supportPlans.length;
        if (recentInteractionsEl) {
            const recentCount = this.interactions.filter(interaction => {
                const interactionDate = new Date(interaction.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return interactionDate >= weekAgo;
            }).length;
            recentInteractionsEl.textContent = recentCount;
        }
    }

    renderRecentActivity() {
        const container = document.getElementById('recentActivityList');
        if (!container) return;

        const recentInteractions = this.interactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        if (recentInteractions.length === 0) {
            container.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-4">No recent activity</p>';
            return;
        }

        container.innerHTML = recentInteractions.map(interaction => {
            const student = this.students.find(s => s.id === interaction.studentId);
            const studentName = student ? student.name : 'Unknown Student';
            
            return `
                <div class="interaction-item cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors" onclick="app.showInteractionDetails('${interaction.id}')">
                    <div class="interaction-icon">
                        ${this.getInteractionIcon(interaction.type)}
                    </div>
                    <div class="flex-1">
                        <p class="font-medium text-gray-800 dark:text-gray-200">${this.getInteractionTypeLabel(interaction.type)}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${studentName} • ${this.formatDate(interaction.date)}</p>
                    </div>
                    <div class="text-gray-400 dark:text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                        </svg>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Students
    renderStudents() {
        this.populateStudentsList();
        this.populateStudentSelects();
    }

    populateStudentsList() {
        const container = document.getElementById('studentsList');
        if (!container) return;

        if (this.students.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-500 dark:text-gray-400 mb-4">No students found</p>
                    <button onclick="app.showModal('addStudentModal')" class="btn-primary">Add First Student</button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.students.map(student => `
            <div class="student-card">
                <div class="student-avatar" onclick="app.viewStudentProfile('${student.id}')">
                    ${student.profileImage ? 
                        `<img src="${student.profileImage}" alt="${student.name}" class="w-full h-full object-cover rounded-full">` :
                        student.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    }
                </div>
                <div class="flex-1" onclick="app.viewStudentProfile('${student.id}')">
                    <h3 class="font-semibold text-gray-800 dark:text-gray-200">${student.name}</h3>
                    <p class="text-gray-600 dark:text-gray-400">Grade ${student.grade}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-500">ID: ${student.id}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="app.editStudent('${student.id}')" class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit Student">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M227.31,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96A16,16,0,0,0,227.31,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.31,64l24-24L216,84.69Z"></path>
                        </svg>
                    </button>
                    <button onclick="app.deleteStudent('${student.id}')" class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Student">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    filterStudents(searchTerm) {
        const filteredStudents = this.students.filter(student => 
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.includes(searchTerm) ||
            student.grade.toString().includes(searchTerm)
        );

        const container = document.getElementById('studentsList');
        if (!container) return;

        if (filteredStudents.length === 0) {
            container.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-4">No students found</p>';
            return;
        }

        container.innerHTML = filteredStudents.map(student => `
            <div class="student-card">
                <div class="student-avatar" onclick="app.viewStudentProfile('${student.id}')">
                    ${student.profileImage ? 
                        `<img src="${student.profileImage}" alt="${student.name}" class="w-full h-full object-cover rounded-full">` :
                        student.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    }
                </div>
                <div class="flex-1" onclick="app.viewStudentProfile('${student.id}')">
                    <h3 class="font-semibold text-gray-800 dark:text-gray-200">${student.name}</h3>
                    <p class="text-gray-600 dark:text-gray-400">Grade ${student.grade}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-500">ID: ${student.id}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="app.editStudent('${student.id}')" class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit Student">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M227.31,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96A16,16,0,0,0,227.31,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.31,64l24-24L216,84.69Z"></path>
                        </svg>
                    </button>
                    <button onclick="app.deleteStudent('${student.id}')" class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Student">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Student Profile
    viewStudentProfile(studentId) {
        this.currentStudent = this.students.find(s => s.id === studentId);
        if (!this.currentStudent) {
            this.showAlert('Student not found', 'error');
            return;
        }
        this.navigateTo('studentProfile');
    }

    renderStudentProfile() {
        if (!this.currentStudent) return;

        const container = document.getElementById('studentProfileView');
        if (!container) return;

        const studentInteractions = this.interactions
            .filter(interaction => interaction.studentId === this.currentStudent.id)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = `
            <div class="p-4">
                <!-- Student Info -->
                <div class="flex flex-col gap-4 items-center mb-6">
                    <div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                        ${this.currentStudent.profileImage ? 
                            `<img src="${this.currentStudent.profileImage}" alt="${this.currentStudent.name}" class="w-full h-full object-cover rounded-full">` :
                            this.currentStudent.name.split(' ').map(n => n[0]).join('').toUpperCase()
                        }
                    </div>
                    <div class="text-center">
                        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">${this.currentStudent.name}</h2>
                        <p class="text-gray-600 dark:text-gray-400">Grade ${this.currentStudent.grade}</p>
                        <p class="text-gray-600 dark:text-gray-400">ID: ${this.currentStudent.id}</p>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="tab-nav mb-6">
                    <button class="tab-btn active" onclick="app.switchTab('interactions')">Interactions</button>
                    <button class="tab-btn" onclick="app.switchTab('support-plans')">Support Plans</button>
                    <button class="tab-btn" onclick="app.switchTab('documents')">Documents</button>
                </div>

                <!-- Tab Content -->
                <div id="interactionsTab" class="tab-content">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Recent Interactions</h3>
                    ${studentInteractions.length === 0 ? 
                        '<p class="text-gray-500 dark:text-gray-400 text-center py-4">No interactions recorded</p>' :
                        studentInteractions.map(interaction => `
                            <div class="interaction-item cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors" onclick="app.showInteractionDetails('${interaction.id}')">
                                <div class="interaction-icon">
                                    ${this.getInteractionIcon(interaction.type)}
                                </div>
                                <div class="flex-1">
                                    <p class="font-medium text-gray-800 dark:text-gray-200">${this.getInteractionTypeLabel(interaction.type)}</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">${this.formatDate(interaction.date)}</p>
                                    <p class="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">${interaction.notes}</p>
                                </div>
                                <div class="text-gray-400 dark:text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                    </svg>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>

                <div id="supportPlansTab" class="tab-content hidden">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">Support Plans</h3>
                        <button onclick="app.showSupportPlanUpload()" class="btn-primary text-sm px-3 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" class="mr-2">
                                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                            </svg>
                            Add Plan
                        </button>
                    </div>
                    <div id="supportPlansList">
                        <!-- Support plans will be rendered here -->
                    </div>
                </div>

                <div id="documentsTab" class="tab-content hidden">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">Documents</h3>
                        <button onclick="app.showDocumentUpload()" class="btn-primary text-sm px-3 py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" class="mr-2">
                                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                            </svg>
                            Add Document
                        </button>
                    </div>
                    <div id="documentsList">
                        <!-- Documents will be rendered here -->
                    </div>
                </div>
            </div>
        `;
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // Hide all tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // Show selected tab content
        const tabMap = {
            'interactions': 'interactionsTab',
            'support-plans': 'supportPlansTab',
            'documents': 'documentsTab'
        };

        const selectedTab = document.getElementById(tabMap[tabName]);
        if (selectedTab) {
            selectedTab.classList.remove('hidden');
        }
    }

    // Log Interaction
    renderLogInteraction() {
        this.populateStudentSelects();
        
        // Set today's date as default
        const dateInput = document.getElementById('interactionDate');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    populateStudentSelects() {
        const selects = ['studentSelect', 'reportStudent'];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;

            // Clear existing options (except first one)
            while (select.children.length > 1) {
                select.removeChild(select.lastChild);
            }

            // Add student options
            this.students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = `${student.name} (Grade ${student.grade})`;
                select.appendChild(option);
            });
        });
    }

    addInteraction() {
        const form = document.getElementById('interactionForm');
        const formData = new FormData(form);
        
        const interaction = {
            id: Date.now().toString(),
            studentId: document.getElementById('studentSelect').value,
            type: document.getElementById('interactionType').value,
            severity: document.getElementById('severityLevel').value || 'no-flag',
            date: document.getElementById('interactionDate').value,
            notes: document.getElementById('interactionNotes').value,
            createdAt: new Date().toISOString()
        };

        // Validation
        if (!interaction.studentId || !interaction.type || !interaction.date || !interaction.notes.trim()) {
            this.showAlert('Please fill in all fields', 'error');
            return;
        }

        this.interactions.push(interaction);
        this.saveToLocalStorage();
        this.showAlert('✅ Interaction logged successfully', 'success');
        
        // Reset form
        form.reset();
        document.getElementById('interactionDate').value = new Date().toISOString().split('T')[0];
        
        // Navigate back to dashboard
        this.navigateTo('dashboard');
    }

    // Reports
    renderReports() {
        this.populateStudentSelects();
        this.generateReport();
        
        // Add event listeners for report filters
        ['reportDateRange', 'reportStudent', 'reportType'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.generateReport());
            }
        });
    }

    generateReport() {
        const dateRange = parseInt(document.getElementById('reportDateRange')?.value || '30');
        const studentId = document.getElementById('reportStudent')?.value || '';
        const interactionType = document.getElementById('reportType')?.value || '';

        // Filter interactions based on criteria
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - dateRange);

        let filteredInteractions = this.interactions.filter(interaction => {
            const interactionDate = new Date(interaction.date);
            return interactionDate >= cutoffDate;
        });

        if (studentId) {
            filteredInteractions = filteredInteractions.filter(i => i.studentId === studentId);
        }

        if (interactionType) {
            filteredInteractions = filteredInteractions.filter(i => i.type === interactionType);
        }

        // Store current report data for downloads
        this.currentReportData = {
            interactions: filteredInteractions,
            dateRange,
            studentId,
            interactionType,
            generatedAt: new Date().toISOString()
        };

        // Generate report content
        this.displayReportResults(filteredInteractions, dateRange);
    }

    displayReportResults(interactions, dateRange) {
        const container = document.getElementById('reportContent');
        if (!container) return;

        if (interactions.length === 0) {
            container.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-4">No interactions found for the selected criteria</p>';
            return;
        }

        // Group by type
        const byType = {};
        interactions.forEach(interaction => {
            if (!byType[interaction.type]) {
                byType[interaction.type] = [];
            }
            byType[interaction.type].push(interaction);
        });

        // Generate summary
        const summary = Object.keys(byType).map(type => ({
            type,
            count: byType[type].length,
            label: this.getInteractionTypeLabel(type)
        })).sort((a, b) => b.count - a.count);

        container.innerHTML = `
            <div class="space-y-6">
                <!-- Summary -->
                <div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-3">Summary (Last ${dateRange} days)</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <p class="text-sm text-blue-800 dark:text-blue-200">Total Interactions</p>
                            <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">${interactions.length}</p>
                        </div>
                        <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <p class="text-sm text-green-800 dark:text-green-200">Most Common</p>
                            <p class="text-lg font-semibold text-green-600 dark:text-green-400">${summary[0]?.label || 'N/A'}</p>
                        </div>
                        <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                            <p class="text-sm text-purple-800 dark:text-purple-200">Students Involved</p>
                            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">${new Set(interactions.map(i => i.studentId)).size}</p>
                        </div>
                    </div>
                </div>

                <!-- By Type -->
                <div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-3">By Interaction Type</h4>
                    <div class="space-y-2">
                        ${summary.map(item => `
                            <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span class="text-gray-800 dark:text-gray-200">${item.label}</span>
                                <span class="font-semibold text-blue-600 dark:text-blue-400">${item.count}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Recent Interactions -->
                <div>
                    <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-3">Recent Interactions</h4>
                    <div class="space-y-2">
                        ${interactions.slice(0, 10).map(interaction => {
                            const student = this.students.find(s => s.id === interaction.studentId);
                            return `
                                <div class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onclick="app.showInteractionDetails('${interaction.id}')">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <p class="font-medium text-gray-800 dark:text-gray-200">${this.getInteractionTypeLabel(interaction.type)}</p>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">${student?.name || 'Unknown Student'} • ${this.formatDate(interaction.date)}</p>
                                        </div>
                                        <div class="text-gray-400 dark:text-gray-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-700 dark:text-gray-300 mt-2">${interaction.notes}</p>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Student Management
    addStudent() {
        const name = document.getElementById('studentName').value.trim();
        const grade = document.getElementById('studentGrade').value;
        const id = document.getElementById('studentId').value.trim();
        const form = document.getElementById('addStudentForm');
        const isEditing = form.dataset.editingId;

        // Validation
        if (!name || !grade || !id) {
            this.showAlert('Please fill in all fields', 'error');
            return;
        }

        if (isEditing) {
            // Editing existing student
            const studentIndex = this.students.findIndex(s => s.id === isEditing);
            if (studentIndex === -1) {
                this.showAlert('Student not found', 'error');
                return;
            }

            // Check for duplicate ID if ID was changed
            if (id !== isEditing && this.students.find(s => s.id === id)) {
                this.showAlert('Student ID already exists', 'error');
                return;
            }

            // Update student
            this.students[studentIndex] = {
                ...this.students[studentIndex],
                id,
                name,
                grade
            };

            // Update associated interactions if ID changed
            if (id !== isEditing) {
                this.interactions = this.interactions.map(interaction => 
                    interaction.studentId === isEditing 
                        ? { ...interaction, studentId: id }
                        : interaction
                );
                this.supportPlans = this.supportPlans.map(plan => 
                    plan.studentId === isEditing 
                        ? { ...plan, studentId: id }
                        : plan
                );
                this.documents = this.documents.map(doc => 
                    doc.studentId === isEditing 
                        ? { ...doc, studentId: id }
                        : doc
                );
            }

            this.showAlert('✅ Student updated successfully', 'success');
        } else {
            // Adding new student
            // Check for duplicate ID
            if (this.students.find(s => s.id === id)) {
                this.showAlert('Student ID already exists', 'error');
                return;
            }

            const student = {
                id,
                name,
                grade,
                profileImage: null,
                createdAt: new Date().toISOString()
            };

            this.students.push(student);
            this.showAlert('✅ Student added successfully', 'success');
        }

        this.saveToLocalStorage();
        
        // Reset form and hide modal
        form.reset();
        form.removeAttribute('data-editing-id');
        form.querySelector('button[type="submit"]').textContent = 'Add Student';
        this.hideModal('addStudentModal');
        
        // Refresh current view if needed
        if (this.currentView === 'students') {
            this.renderStudents();
        }
        this.updateStats();
    }

    // Helper Functions
    handleAddButtonClick() {
        switch (this.currentView) {
            case 'students':
                this.showModal('addStudentModal');
                break;
            case 'logInteraction':
                // Already on the add interaction page
                break;
            case 'reports':
                // No add button functionality for reports
                break;
            default:
                this.navigateTo('logInteraction');
                break;
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showAlert(message, type = 'info') {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full mx-4`;
        alert.textContent = message;

        // Add to page
        document.body.appendChild(alert);

        // Remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(alert)) {
                document.body.removeChild(alert);
            }
        }, 3000);
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    getInteractionIcon(type) {
        const icons = {
            'behavioral-incident': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path></svg>',
            'counseling-session': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM128,72a12,12,0,1,0,12,12A12,12,0,0,0,128,72Zm0,112a12,12,0,1,0,12,12A12,12,0,0,0,128,184Z"></path></svg>',
            'parent-meeting': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path></svg>',
            'academic-support': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M226.53,56.41l-96-32a8,8,0,0,0-5.06,0l-96,32A8,8,0,0,0,24,64v80a8,8,0,0,0,16,0V75.1L73.59,86.29a64,64,0,0,0,20.65,88.05c-18,7.06-33.56,19.83-44.94,37.29a8,8,0,1,0,13.4,8.74C77.77,197.25,101.57,184,128,184s50.23,13.25,65.3,36.37a8,8,0,0,0,13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64,64,0,0,0,20.65-88l44.12-14.7a8,8,0,0,0,0-15.18ZM176,120A48,48,0,1,1,89.35,91.55l36.12,12a8,8,0,0,0,5.06,0l36.12-12A47.89,47.89,0,0,1,176,120ZM128,87.57,57.3,64,128,40.43,198.7,64Z"></path></svg>',
            'check-in': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path></svg>'
        };
        return icons[type] || icons['check-in'];
    }

    getInteractionTypeLabel(type) {
        const labels = {
            'behavioral-incident': 'Behavioral Incident',
            'counseling-session': 'Counseling Session',
            'parent-meeting': 'Parent Meeting',
            'academic-support': 'Academic Support',
            'check-in': 'Check-in'
        };
        return labels[type] || type;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showInteractionDetails(interactionId) {
        const interaction = this.interactions.find(i => i.id === interactionId);
        if (!interaction) return;

        const student = this.students.find(s => s.id === interaction.studentId);
        const studentName = student ? student.name : 'Unknown Student';

        const modalHtml = `
            <div id="interactionDetailsModal" class="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Interaction Details</h3>
                        <button onclick="app.closeInteractionDetails()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="space-y-4">
                        <div class="flex items-center gap-3">
                            <div class="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                                ${this.getInteractionIcon(interaction.type)}
                            </div>
                            <div>
                                <h4 class="font-medium text-gray-800 dark:text-gray-200">${this.getInteractionTypeLabel(interaction.type)}</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${studentName}</p>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                            <p class="text-gray-800 dark:text-gray-200">${this.formatDate(interaction.date)}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                            <p class="text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">${interaction.notes || 'No notes provided'}</p>
                        </div>
                    </div>
                    <div class="flex justify-end mt-6">
                        <button onclick="app.closeInteractionDetails()" class="btn-secondary">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    closeInteractionDetails() {
        const modal = document.getElementById('interactionDetailsModal');
        if (modal) {
            modal.remove();
        }
    }

    editStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        // Pre-fill the form with existing data
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentGrade').value = student.grade;
        document.getElementById('studentId').value = student.id;
        
        // Change the form behavior to edit mode
        const form = document.getElementById('addStudentForm');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Student';
        
        // Store the original student ID for updating
        form.dataset.editingId = student.id;
        
        this.showModal('addStudentModal');
    }

    deleteStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        const confirmDelete = confirm(`Are you sure you want to delete ${student.name}? This action cannot be undone.`);
        if (confirmDelete) {
            // Remove student
            this.students = this.students.filter(s => s.id !== studentId);
            
            // Remove associated interactions
            this.interactions = this.interactions.filter(i => i.studentId !== studentId);
            
            // Remove associated support plans
            this.supportPlans = this.supportPlans.filter(sp => sp.studentId !== studentId);
            
            // Remove associated documents
            this.documents = this.documents.filter(doc => doc.studentId !== studentId);
            
            this.saveToLocalStorage();
            this.renderCurrentView();
            this.updateStats();
            this.showAlert('🗑️ Student deleted successfully', 'success');
        }
    }

    switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.add('hidden');
        });

        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab content
        const targetTab = document.getElementById(`${tabName}Tab`);
        if (targetTab) {
            targetTab.classList.remove('hidden');
        }

        // Add active class to clicked button
        event.target.classList.add('active');

        // Render tab-specific content
        this.renderTabContent(tabName);
    }

    renderTabContent(tabName) {
        if (!this.currentStudent) return;

        switch (tabName) {
            case 'interactions':
                // Already rendered in renderStudentProfile
                break;
            case 'support-plans':
                this.renderSupportPlans();
                break;
            case 'documents':
                this.renderDocuments();
                break;
        }
    }

    renderSupportPlans() {
        const container = document.getElementById('supportPlansList');
        if (!container) return;

        const studentPlans = this.supportPlans.filter(plan => plan.studentId === this.currentStudent.id);
        
        if (studentPlans.length === 0) {
            container.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-8">No support plans created</p>';
            return;
        }

        container.innerHTML = studentPlans.map(plan => `
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-3">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800 dark:text-gray-200">${plan.title}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${plan.description}</p>
                        <div class="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>Created: ${this.formatDate(plan.createdAt)}</span>
                            ${plan.fileSize ? `<span>Size: ${this.formatFileSize(plan.fileSize)}</span>` : ''}
                        </div>
                    </div>
                    <div class="flex items-center gap-2 ml-4">
                        ${plan.filePath ? `
                            <button onclick="app.viewSupportPlan('${plan.id}')" class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="View Plan">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.48c.35.79,8.82,19.58,27.65,38.41C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.35c18.83-18.83,27.3-37.62,27.65-38.41A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.47,133.47,0,0,1,231,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                                </svg>
                            </button>
                        ` : ''}
                        <button onclick="app.editSupportPlan('${plan.id}')" class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit Plan">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M227.31,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96A16,16,0,0,0,227.31,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.31,64l24-24L216,84.69Z"></path>
                            </svg>
                        </button>
                        <button onclick="app.deleteSupportPlan('${plan.id}')" class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Plan">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderDocuments() {
        const container = document.getElementById('documentsList');
        if (!container) return;

        const studentDocs = this.documents.filter(doc => doc.studentId === this.currentStudent.id);
        
        if (studentDocs.length === 0) {
            container.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-8">No documents uploaded</p>';
            return;
        }

        container.innerHTML = studentDocs.map(doc => `
            <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-3">
                <div class="flex items-start justify-between">
                    <div class="flex items-start gap-3 flex-1">
                        <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                            ${this.getFileIcon(doc.fileType)}
                        </div>
                        <div class="flex-1">
                            <h4 class="font-semibold text-gray-800 dark:text-gray-200">${doc.name}</h4>
                            <div class="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span>${doc.fileType.toUpperCase()}</span>
                                <span>${this.formatFileSize(doc.fileSize)}</span>
                                <span>Uploaded: ${this.formatDate(doc.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 ml-4">
                        <button onclick="app.viewDocument('${doc.id}')" class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="View Document">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.48c.35.79,8.82,19.58,27.65,38.41C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.35c18.83-18.83,27.3-37.62,27.65-38.41A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.47,133.47,0,0,1,231,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                            </svg>
                        </button>
                        <button onclick="app.downloadDocument('${doc.id}')" class="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Download">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"></path>
                            </svg>
                        </button>
                        <button onclick="app.deleteDocument('${doc.id}')" class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Document">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Utility methods for file handling
BSSApp.prototype.formatFileSize = function(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

BSSApp.prototype.getFileIcon = function(fileType) {
    const icons = {
        'pdf': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#DC3545" viewBox="0 0 256 256"><path d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152Z"></path></svg>',
        'doc': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#2B579A" viewBox="0 0 256 256"><path d="M52,144H36a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8H52a36,36,0,0,0,0-72Z"></path></svg>',
        'txt': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6C757D" viewBox="0 0 256 256"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34Z"></path></svg>',
        'json': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FFC107" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Z"></path></svg>',
        'html': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#E34F26" viewBox="0 0 256 256"><path d="M71,136l8,48H152l-8,48L108,248h40l36-216H71Z"></path></svg>',
        'default': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#6C757D" viewBox="0 0 256 256"><path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34Z"></path></svg>'
    };
    return icons[fileType] || icons['default'];
};

// Support Plans methods
BSSApp.prototype.showSupportPlanUpload = function() {
    const modalHtml = `
        <div id="supportPlanModal" class="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Add Support Plan</h3>
                <form id="supportPlanForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plan Title</label>
                        <input type="text" id="planTitle" required class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <textarea id="planDescription" rows="3" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload File (Optional)</label>
                        <input type="file" id="planFile" accept=".pdf,.doc,.docx,.txt" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="submit" class="btn-primary flex-1">Save Plan</button>
                        <button type="button" onclick="app.closeSupportPlanModal()" class="btn-secondary flex-1">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    document.getElementById('supportPlanForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSupportPlan();
    });
};

BSSApp.prototype.showDocumentUpload = function() {
    const modalHtml = `
        <div id="documentModal" class="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Upload Document</h3>
                <form id="documentForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Document Name</label>
                        <input type="text" id="docName" required class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload File</label>
                        <input type="file" id="docFile" accept=".txt,.doc,.docx,.pdf,.html,.json" required class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        <p class="text-xs text-gray-500 mt-1">Supports: .txt, .doc, .docx, .pdf, .html, .json</p>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="submit" class="btn-primary flex-1">Upload</button>
                        <button type="button" onclick="app.closeDocumentModal()" class="btn-secondary flex-1">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    document.getElementById('documentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveDocument();
    });
};

BSSApp.prototype.saveSupportPlan = function() {
    const title = document.getElementById('planTitle').value.trim();
    const description = document.getElementById('planDescription').value.trim();
    const fileInput = document.getElementById('planFile');
    
    if (!title) {
        this.showAlert('Please enter a plan title', 'error');
        return;
    }

    const plan = {
        id: Date.now().toString(),
        studentId: this.currentStudent.id,
        title,
        description,
        createdAt: new Date().toISOString(),
        filePath: null,
        fileName: null,
        fileSize: null,
        fileType: null
    };

    // Handle file upload simulation (in real app, this would upload to server or use File System API)
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        plan.fileName = file.name;
        plan.fileSize = file.size;
        plan.fileType = file.type;
        // In a real app, you'd upload the file and store the path
        plan.filePath = `local://support-plans/${plan.id}/${file.name}`;
    }

    this.supportPlans.push(plan);
    this.saveToLocalStorage();
    this.renderSupportPlans();
    this.closeSupportPlanModal();
    this.showAlert('✅ Support plan saved successfully', 'success');
};

BSSApp.prototype.saveDocument = function() {
    const name = document.getElementById('docName').value.trim();
    const fileInput = document.getElementById('docFile');
    
    if (!name || !fileInput.files || !fileInput.files[0]) {
        this.showAlert('Please provide both name and file', 'error');
        return;
    }

    const file = fileInput.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    const doc = {
        id: Date.now().toString(),
        studentId: this.currentStudent.id,
        name,
        fileName: file.name,
        fileSize: file.size,
        fileType: fileExtension,
        filePath: `local://documents/${this.currentStudent.id}/${file.name}`,
        createdAt: new Date().toISOString()
    };

    this.documents.push(doc);
    this.saveToLocalStorage();
    this.renderDocuments();
    this.closeDocumentModal();
    this.showAlert('📄 Document uploaded successfully', 'success');
};

BSSApp.prototype.closeSupportPlanModal = function() {
    const modal = document.getElementById('supportPlanModal');
    if (modal) modal.remove();
};

BSSApp.prototype.closeDocumentModal = function() {
    const modal = document.getElementById('documentModal');
    if (modal) modal.remove();
};

BSSApp.prototype.deleteSupportPlan = function(planId) {
    const plan = this.supportPlans.find(p => p.id === planId);
    if (!plan) return;

    if (confirm(`Are you sure you want to delete "${plan.title}"? This action cannot be undone.`)) {
        this.supportPlans = this.supportPlans.filter(p => p.id !== planId);
        this.saveToLocalStorage();
        this.renderSupportPlans();
        this.showAlert('Support plan deleted successfully', 'success');
    }
};

BSSApp.prototype.deleteDocument = function(docId) {
    const doc = this.documents.find(d => d.id === docId);
    if (!doc) return;

    if (confirm(`Are you sure you want to delete "${doc.name}"? This action cannot be undone.`)) {
        this.documents = this.documents.filter(d => d.id !== docId);
        this.saveToLocalStorage();
        this.renderDocuments();
        this.showAlert('Document deleted successfully', 'success');
    }
};

BSSApp.prototype.downloadReport = function(format) {
    if (!this.currentReportData) {
        this.showAlert('No report data available. Please generate a report first.', 'error');
        return;
    }

    const reportData = this.currentReportData;
    const studentName = reportData.studentId ? 
        this.students.find(s => s.id === reportData.studentId)?.name || 'Unknown Student' : 
        'All Students';

    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
        case 'txt':
            content = this.generateTextReport(reportData, studentName);
            filename = `BSS_Report_${new Date().toISOString().split('T')[0]}.txt`;
            mimeType = 'text/plain';
            break;
        case 'pdf':
            // Note: This is a simplified PDF generation - in production, you'd use a library like jsPDF
            content = this.generateTextReport(reportData, studentName);
            filename = `BSS_Report_${new Date().toISOString().split('T')[0]}.pdf`;
            mimeType = 'application/pdf';
            this.showAlert('PDF generation requires additional library. Downloading as TXT instead.', 'warning');
            break;
        case 'docx':
            content = this.generateTextReport(reportData, studentName);
            filename = `BSS_Report_${new Date().toISOString().split('T')[0]}.docx`;
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            this.showAlert('DOCX generation requires additional library. Downloading as TXT instead.', 'warning');
            break;
        case 'xlsx':
            content = this.generateCSVReport(reportData, studentName);
            filename = `BSS_Report_${new Date().toISOString().split('T')[0]}.csv`;
            mimeType = 'text/csv';
            this.showAlert('XLSX generation requires additional library. Downloading as CSV instead.', 'warning');
            break;
    }

    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.showAlert(`📥 Report downloaded as ${filename}`, 'success');
};

BSSApp.prototype.generateTextReport = function(reportData, studentName) {
    const { interactions, dateRange, interactionType } = reportData;
    let content = `Katie's Behavior Support Specialist - Report\n`;
    content += `Generated: ${new Date().toLocaleDateString()}\n`;
    content += `Date Range: Last ${dateRange} days\n`;
    content += `Student: ${studentName}\n`;
    content += `Interaction Type: ${interactionType ? this.getInteractionTypeLabel(interactionType) : 'All Types'}\n`;
    content += `\n${'='.repeat(50)}\n\n`;

    if (interactions.length === 0) {
        content += `No interactions found for the selected criteria.\n`;
        return content;
    }

    // Summary
    content += `SUMMARY\n`;
    content += `${'='.repeat(20)}\n`;
    content += `Total Interactions: ${interactions.length}\n`;
    
    // Group by type
    const byType = {};
    interactions.forEach(interaction => {
        if (!byType[interaction.type]) {
            byType[interaction.type] = [];
        }
        byType[interaction.type].push(interaction);
    });

    content += `By Type:\n`;
    Object.keys(byType).forEach(type => {
        content += `  - ${this.getInteractionTypeLabel(type)}: ${byType[type].length}\n`;
    });

    content += `Students Involved: ${new Set(interactions.map(i => i.studentId)).size}\n\n`;

    // Detailed interactions
    content += `DETAILED INTERACTIONS\n`;
    content += `${'='.repeat(30)}\n\n`;

    interactions.forEach((interaction, index) => {
        const student = this.students.find(s => s.id === interaction.studentId);
        content += `${index + 1}. ${this.getInteractionTypeLabel(interaction.type)}\n`;
        content += `   Student: ${student?.name || 'Unknown Student'}\n`;
        content += `   Date: ${this.formatDate(interaction.date)}\n`;
        content += `   Notes: ${interaction.notes}\n\n`;
    });

    return content;
};

BSSApp.prototype.generateCSVReport = function(reportData, studentName) {
    const { interactions } = reportData;
    let csv = 'Date,Student,Type,Notes\n';
    
    interactions.forEach(interaction => {
        const student = this.students.find(s => s.id === interaction.studentId);
        const studentName = student?.name || 'Unknown Student';
        const type = this.getInteractionTypeLabel(interaction.type);
        const notes = interaction.notes.replace(/"/g, '""'); // Escape quotes
        csv += `"${interaction.date}","${studentName}","${type}","${notes}"\n`;
    });

    return csv;
};

BSSApp.prototype.viewDocument = function(docId) {
    const doc = this.documents.find(d => d.id === docId);
    if (!doc) return;

    // Create a modal to view document content
    const modalHtml = `
        <div id="documentViewModal" class="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">📄 ${doc.name}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${doc.fileType.toUpperCase()} • ${this.formatFileSize(doc.fileSize)}</p>
                    </div>
                    <button onclick="app.closeDocumentViewModal()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                        </svg>
                    </button>
                </div>
                <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <p class="text-gray-700 dark:text-gray-300">📁 Document preview is not available in this demo version.</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">In a full implementation, document content would be displayed here based on the file type.</p>
                    <div class="mt-4 flex gap-2">
                        <button onclick="app.downloadDocument('${doc.id}')" class="btn-primary text-sm">
                            📥 Download Document
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
};

BSSApp.prototype.closeDocumentViewModal = function() {
    const modal = document.getElementById('documentViewModal');
    if (modal) modal.remove();
};

BSSApp.prototype.downloadDocument = function(docId) {
    const doc = this.documents.find(d => d.id === docId);
    if (!doc) return;

    // In a real application, this would download the actual file
    // For demo purposes, we'll create a placeholder file
    const content = `Document: ${doc.name}\nFile Type: ${doc.fileType}\nUploaded: ${this.formatDate(doc.createdAt)}\nStudent: ${this.currentStudent?.name || 'N/A'}\n\nThis is a placeholder document created in Katie's BSS App demo.\nIn a real implementation, the original document content would be downloaded.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.showAlert(`📥 Downloaded ${doc.name}`, 'success');
};

BSSApp.prototype.performGlobalSearch = function(searchTerm) {
    if (!searchTerm.trim()) {
        this.renderRecentActivity();
        return;
    }

    const term = searchTerm.toLowerCase();
    const results = [];

    // Search students
    this.students.forEach(student => {
        if (student.name.toLowerCase().includes(term) || 
            student.id.toLowerCase().includes(term) || 
            student.grade.toString().includes(term)) {
            results.push({
                type: '👤 Student',
                title: student.name,
                subtitle: `Grade ${student.grade} • ID: ${student.id}`,
                action: () => this.viewStudentProfile(student.id),
                date: student.createdAt
            });
        }
    });

    // Search interactions
    this.interactions.forEach(interaction => {
        const student = this.students.find(s => s.id === interaction.studentId);
        if (interaction.notes.toLowerCase().includes(term) || 
            this.getInteractionTypeLabel(interaction.type).toLowerCase().includes(term) ||
            (student && student.name.toLowerCase().includes(term))) {
            results.push({
                type: this.getInteractionIcon(interaction.type) + ' Interaction',
                title: this.getInteractionTypeLabel(interaction.type),
                subtitle: `${student?.name || 'Unknown Student'} • ${this.formatDate(interaction.date)}`,
                action: () => this.showInteractionDetails(interaction.id),
                date: interaction.date,
                severity: interaction.severity || 'no-flag'
            });
        }
    });

    // Search support plans
    this.supportPlans.forEach(plan => {
        if (plan.title.toLowerCase().includes(term) || 
            (plan.description && plan.description.toLowerCase().includes(term))) {
            const student = this.students.find(s => s.id === plan.studentId);
            results.push({
                type: '📋 Support Plan',
                title: plan.title,
                subtitle: `${student?.name || 'Unknown Student'} • ${this.formatDate(plan.createdAt)}`,
                action: () => {
                    this.viewStudentProfile(plan.studentId);
                    setTimeout(() => this.switchTab('support-plans'), 100);
                },
                date: plan.createdAt
            });
        }
    });

    // Search documents
    this.documents.forEach(doc => {
        if (doc.name.toLowerCase().includes(term) || 
            doc.fileName.toLowerCase().includes(term)) {
            const student = this.students.find(s => s.id === doc.studentId);
            results.push({
                type: '📄 Document',
                title: doc.name,
                subtitle: `${student?.name || 'Unknown Student'} • ${doc.fileType.toUpperCase()}`,
                action: () => {
                    this.viewStudentProfile(doc.studentId);
                    setTimeout(() => this.switchTab('documents'), 100);
                },
                date: doc.createdAt
            });
        }
    });

    // Sort results by relevance and date
    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    this.displaySearchResults(results, searchTerm);
};

BSSApp.prototype.displaySearchResults = function(results, searchTerm) {
    const container = document.getElementById('recentActivityList');
    if (!container) return;

    if (results.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                <div class="text-4xl mb-4">🔍</div>
                <p class="text-lg font-medium mb-2">No results found</p>
                <p class="text-sm">Try searching for student names, interaction notes, or document titles</p>
            </div>
        `;
        return;
    }

    const resultsHtml = `
        <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p class="text-blue-800 dark:text-blue-200 font-medium">
                🔍 Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${searchTerm}"
            </p>
        </div>
        ${results.slice(0, 10).map(result => `
            <div class="search-result-item cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-3 rounded-lg transition-colors border border-gray-200 dark:border-gray-700" onclick="event.preventDefault(); (${result.action.toString()})();">
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm">
                        ${result.type.split(' ')[0]}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between">
                            <div>
                                <p class="font-medium text-gray-800 dark:text-gray-200 truncate">${result.title}</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${result.subtitle}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">${result.type}</p>
                                ${result.severity && result.severity !== 'no-flag' ? `
                                    <div class="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${this.getSeverityClasses(result.severity)}">
                                        ${this.getSeverityIcon(result.severity)} ${this.getSeverityLabel(result.severity)}
                                    </div>
                                ` : ''}
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" class="text-gray-400 dark:text-gray-500 flex-shrink-0">
                                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `).join('')}
        ${results.length > 10 ? `
            <div class="text-center py-3 text-gray-500 dark:text-gray-400 text-sm">
                ... and ${results.length - 10} more results
            </div>
        ` : ''}
    `;

    container.innerHTML = resultsHtml;
};

BSSApp.prototype.getSeverityIcon = function(severity) {
    const icons = {
        'red-flag': '🔴',
        'yellow-flag': '🟡',
        'green-flag': '🟢',
        'no-flag': '🔵'
    };
    return icons[severity] || icons['no-flag'];
};

BSSApp.prototype.getSeverityLabel = function(severity) {
    const labels = {
        'red-flag': 'Urgent',
        'yellow-flag': 'Caution',
        'green-flag': 'Positive',
        'no-flag': 'Routine'
    };
    return labels[severity] || 'Routine';
};

BSSApp.prototype.getSeverityClasses = function(severity) {
    const classes = {
        'red-flag': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
        'yellow-flag': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
        'green-flag': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
        'no-flag': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
    };
    return classes[severity] || classes['no-flag'];
};

BSSApp.prototype.showExportModal = function() {
    const modalHtml = `
        <div id="exportModal" class="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">📥 Export Data</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Choose what data to export:</p>
                <div class="space-y-3 mb-6">
                    <label class="flex items-center">
                        <input type="checkbox" id="exportStudents" checked class="mr-3">
                        <span class="text-gray-800 dark:text-gray-200">👤 Students (${this.students.length})</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" id="exportInteractions" checked class="mr-3">
                        <span class="text-gray-800 dark:text-gray-200">📝 Interactions (${this.interactions.length})</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" id="exportSupportPlans" checked class="mr-3">
                        <span class="text-gray-800 dark:text-gray-200">📋 Support Plans (${this.supportPlans.length})</span>
                    </label>
                    <label class="flex items-center">
                        <input type="checkbox" id="exportDocuments" checked class="mr-3">
                        <span class="text-gray-800 dark:text-gray-200">📄 Documents (${this.documents.length})</span>
                    </label>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Export Format:</label>
                    <select id="exportFormat" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        <option value="json">JSON (Complete Data)</option>
                        <option value="csv">CSV (Tabular Data)</option>
                        <option value="txt">Text Summary</option>
                    </select>
                </div>
                <div class="flex gap-3 pt-4">
                    <button onclick="app.exportData()" class="btn-primary flex-1">📥 Export</button>
                    <button onclick="app.closeExportModal()" class="btn-secondary flex-1">Cancel</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
};

BSSApp.prototype.closeExportModal = function() {
    const modal = document.getElementById('exportModal');
    if (modal) modal.remove();
};

BSSApp.prototype.exportData = function() {
    const includeStudents = document.getElementById('exportStudents').checked;
    const includeInteractions = document.getElementById('exportInteractions').checked;
    const includeSupportPlans = document.getElementById('exportSupportPlans').checked;
    const includeDocuments = document.getElementById('exportDocuments').checked;
    const format = document.getElementById('exportFormat').value;

    const exportData = {
        exportDate: new Date().toISOString(),
        appName: "Katie's Behavior Support Specialist App",
        version: "1.0.0"
    };

    if (includeStudents) exportData.students = this.students;
    if (includeInteractions) exportData.interactions = this.interactions;
    if (includeSupportPlans) exportData.supportPlans = this.supportPlans;
    if (includeDocuments) exportData.documents = this.documents;

    let content = '';
    let filename = '';
    let mimeType = '';

    const timestamp = new Date().toISOString().split('T')[0];

    switch (format) {
        case 'json':
            content = JSON.stringify(exportData, null, 2);
            filename = `katie_bss_export_${timestamp}.json`;
            mimeType = 'application/json';
            break;
        case 'csv':
            content = this.generateCSVExport(exportData);
            filename = `katie_bss_export_${timestamp}.csv`;
            mimeType = 'text/csv';
            break;
        case 'txt':
            content = this.generateTextExport(exportData);
            filename = `katie_bss_export_${timestamp}.txt`;
            mimeType = 'text/plain';
            break;
    }

    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.closeExportModal();
    this.showAlert(`📥 Data exported successfully as ${filename}`, 'success');
};

BSSApp.prototype.generateCSVExport = function(exportData) {
    let csv = '';

    if (exportData.students) {
        csv += 'STUDENTS\n';
        csv += 'ID,Name,Grade,Created Date\n';
        exportData.students.forEach(student => {
            csv += `"${student.id}","${student.name}","${student.grade}","${student.createdAt}"\n`;
        });
        csv += '\n';
    }

    if (exportData.interactions) {
        csv += 'INTERACTIONS\n';
        csv += 'Date,Student,Type,Severity,Notes\n';
        exportData.interactions.forEach(interaction => {
            const student = this.students.find(s => s.id === interaction.studentId);
            const notes = interaction.notes.replace(/"/g, '""');
            csv += `"${interaction.date}","${student?.name || 'Unknown'}","${this.getInteractionTypeLabel(interaction.type)}","${this.getSeverityLabel(interaction.severity || 'no-flag')}","${notes}"\n`;
        });
        csv += '\n';
    }

    if (exportData.supportPlans) {
        csv += 'SUPPORT PLANS\n';
        csv += 'Student,Title,Description,Created Date\n';
        exportData.supportPlans.forEach(plan => {
            const student = this.students.find(s => s.id === plan.studentId);
            const description = (plan.description || '').replace(/"/g, '""');
            csv += `"${student?.name || 'Unknown'}","${plan.title}","${description}","${plan.createdAt}"\n`;
        });
    }

    return csv;
};

BSSApp.prototype.generateTextExport = function(exportData) {
    let content = `Katie's Behavior Support Specialist - Data Export\n`;
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `${'='.repeat(60)}\n\n`;

    if (exportData.students) {
        content += `STUDENTS (${exportData.students.length})\n`;
        content += `${'='.repeat(20)}\n`;
        exportData.students.forEach(student => {
            content += `• ${student.name} (Grade ${student.grade}) - ID: ${student.id}\n`;
        });
        content += '\n';
    }

    if (exportData.interactions) {
        content += `INTERACTIONS (${exportData.interactions.length})\n`;
        content += `${'='.repeat(25)}\n`;
        exportData.interactions.forEach(interaction => {
            const student = this.students.find(s => s.id === interaction.studentId);
            content += `${this.formatDate(interaction.date)} - ${this.getInteractionTypeLabel(interaction.type)}\n`;
            content += `Student: ${student?.name || 'Unknown'}\n`;
            content += `Severity: ${this.getSeverityLabel(interaction.severity || 'no-flag')}\n`;
            content += `Notes: ${interaction.notes}\n\n`;
        });
    }

    if (exportData.supportPlans) {
        content += `SUPPORT PLANS (${exportData.supportPlans.length})\n`;
        content += `${'='.repeat(28)}\n`;
        exportData.supportPlans.forEach(plan => {
            const student = this.students.find(s => s.id === plan.studentId);
            content += `${plan.title}\n`;
            content += `Student: ${student?.name || 'Unknown'}\n`;
            content += `Created: ${this.formatDate(plan.createdAt)}\n`;
            if (plan.description) {
                content += `Description: ${plan.description}\n`;
            }
            content += '\n';
        });
    }

    return content;
};

BSSApp.prototype.editSupportPlan = function(planId) {
    const plan = this.supportPlans.find(p => p.id === planId);
    if (!plan) return;

    const modalHtml = `
        <div id="editSupportPlanModal" class="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">📝 Edit Support Plan</h3>
                <form id="editSupportPlanForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plan Title</label>
                        <input type="text" id="editPlanTitle" value="${plan.title}" required class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <textarea id="editPlanDescription" rows="3" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">${plan.description || ''}</textarea>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="submit" class="btn-primary flex-1">Update Plan</button>
                        <button type="button" onclick="app.closeEditSupportPlanModal()" class="btn-secondary flex-1">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    document.getElementById('editSupportPlanForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this.updateSupportPlan(planId);
    });
};

BSSApp.prototype.closeEditSupportPlanModal = function() {
    const modal = document.getElementById('editSupportPlanModal');
    if (modal) modal.remove();
};

BSSApp.prototype.updateSupportPlan = function(planId) {
    const title = document.getElementById('editPlanTitle').value.trim();
    const description = document.getElementById('editPlanDescription').value.trim();
    
    if (!title) {
        this.showAlert('Please enter a plan title', 'error');
        return;
    }

    const planIndex = this.supportPlans.findIndex(p => p.id === planId);
    if (planIndex === -1) return;

    this.supportPlans[planIndex] = {
        ...this.supportPlans[planIndex],
        title,
        description,
        updatedAt: new Date().toISOString()
    };

    this.saveToLocalStorage();
    this.renderSupportPlans();
    this.closeEditSupportPlanModal();
    this.showAlert('✅ Support plan updated successfully', 'success');
};

BSSApp.prototype.viewSupportPlan = function(planId) {
    const plan = this.supportPlans.find(p => p.id === planId);
    if (!plan) return;

    const modalHtml = `
        <div id="viewSupportPlanModal" class="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">📋 ${plan.title}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Created: ${this.formatDate(plan.createdAt)}</p>
                    </div>
                    <button onclick="app.closeViewSupportPlanModal()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                        </svg>
                    </button>
                </div>
                <div class="space-y-4">
                    ${plan.description ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                <p class="text-gray-800 dark:text-gray-200">${plan.description}</p>
                            </div>
                        </div>
                    ` : ''}
                    ${plan.fileName ? `
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attached File</label>
                            <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                                <p class="text-gray-800 dark:text-gray-200">📎 ${plan.fileName}</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Size: ${this.formatFileSize(plan.fileSize)}</p>
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="flex justify-end mt-6 gap-3">
                    <button onclick="app.editSupportPlan('${plan.id}'); app.closeViewSupportPlanModal();" class="btn-primary text-sm">Edit Plan</button>
                    <button onclick="app.closeViewSupportPlanModal()" class="btn-secondary text-sm">Close</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
};

BSSApp.prototype.closeViewSupportPlanModal = function() {
    const modal = document.getElementById('viewSupportPlanModal');
    if (modal) modal.remove();
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BSSApp();
});

// Expose app globally for onclick handlers
window.app = null;