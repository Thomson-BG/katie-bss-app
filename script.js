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
        
        this.init();
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

        // FAB button
        document.getElementById('fabBtn').addEventListener('click', () => {
            this.scrollToTop();
        });

        // Search functionality
        const searchInput = document.getElementById('studentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterStudents(e.target.value);
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

        document.getElementById('pageTitle').textContent = titles[view] || 'Dashboard';
        this.currentView = view;

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
                <div class="interaction-item">
                    <div class="interaction-icon">
                        ${this.getInteractionIcon(interaction.type)}
                    </div>
                    <div class="flex-1">
                        <p class="font-medium text-gray-800 dark:text-gray-200">${this.getInteractionTypeLabel(interaction.type)}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${studentName} • ${this.formatDate(interaction.date)}</p>
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
            <div class="student-card" onclick="app.viewStudentProfile('${student.id}')">
                <div class="student-avatar">
                    ${student.profileImage ? 
                        `<img src="${student.profileImage}" alt="${student.name}" class="w-full h-full object-cover rounded-full">` :
                        student.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    }
                </div>
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-800 dark:text-gray-200">${student.name}</h3>
                    <p class="text-gray-600 dark:text-gray-400">Grade ${student.grade}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-500">ID: ${student.id}</p>
                </div>
                <div class="text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                    </svg>
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
            <div class="student-card" onclick="app.viewStudentProfile('${student.id}')">
                <div class="student-avatar">
                    ${student.profileImage ? 
                        `<img src="${student.profileImage}" alt="${student.name}" class="w-full h-full object-cover rounded-full">` :
                        student.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    }
                </div>
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-800 dark:text-gray-200">${student.name}</h3>
                    <p class="text-gray-600 dark:text-gray-400">Grade ${student.grade}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-500">ID: ${student.id}</p>
                </div>
                <div class="text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                    </svg>
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
                            <div class="interaction-item">
                                <div class="interaction-icon">
                                    ${this.getInteractionIcon(interaction.type)}
                                </div>
                                <div class="flex-1">
                                    <p class="font-medium text-gray-800 dark:text-gray-200">${this.getInteractionTypeLabel(interaction.type)}</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400">${this.formatDate(interaction.date)}</p>
                                    <p class="text-sm text-gray-700 dark:text-gray-300 mt-1">${interaction.notes}</p>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>

                <div id="supportPlansTab" class="tab-content hidden">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Support Plans</h3>
                    <p class="text-gray-500 dark:text-gray-400 text-center py-4">No support plans created</p>
                </div>

                <div id="documentsTab" class="tab-content hidden">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Documents</h3>
                    <p class="text-gray-500 dark:text-gray-400 text-center py-4">No documents uploaded</p>
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
        this.showAlert('Interaction logged successfully', 'success');
        
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
                                <div class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <p class="font-medium text-gray-800 dark:text-gray-200">${this.getInteractionTypeLabel(interaction.type)}</p>
                                            <p class="text-sm text-gray-600 dark:text-gray-400">${student?.name || 'Unknown Student'} • ${this.formatDate(interaction.date)}</p>
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

        // Validation
        if (!name || !grade || !id) {
            this.showAlert('Please fill in all fields', 'error');
            return;
        }

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
        this.saveToLocalStorage();
        this.showAlert('Student added successfully', 'success');
        
        // Reset form and hide modal
        document.getElementById('addStudentForm').reset();
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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BSSApp();
});

// Expose app globally for onclick handlers
window.app = null;