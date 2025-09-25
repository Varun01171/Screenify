// HR Dashboard Application
class HRDashboard {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.activeView = 'dashboard';
        this.candidates = [];
        this.notifications = [];
        this.metrics = {
            totalCandidates: 42,
            pending: 15,
            screening: 8,
            shortlisted: 12,
            rejected: 2,
            hired: 5,
            averageScore: 78
        };
        this.chatSessions = [];
        this.dbStatus = 'connected';
        this.candidateFilter = 'all';
        this.searchQuery = '';

        // Initialize application
        this.init();
    }

    init() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Check for demo mode
        const urlParams = new URLSearchParams(window.location.search);
        const isDemo = urlParams.get('demo') === 'chat';
        
        if (isDemo) {
            this.showDemoChat();
            return;
        }

        // Check for candidate chat mode
        const sessionId = urlParams.get('session');
        const candidateId = urlParams.get('candidate');
        const candidateName = urlParams.get('name');
        const position = urlParams.get('position');

        if (sessionId && candidateId && candidateName && position) {
            this.showCandidateChat({
                sessionId: decodeURIComponent(sessionId),
                candidateId: decodeURIComponent(candidateId),
                candidateName: decodeURIComponent(candidateName),
                position: decodeURIComponent(position)
            });
            return;
        }

        // Load mock data
        this.loadMockData();

        // Setup event listeners
        this.setupEventListeners();

        // Show loading screen briefly
        setTimeout(() => {
            this.hideLoadingScreen();
            
            // Check authentication
            const token = localStorage.getItem('hr_token');
            if (token) {
                this.handleAuthentication(true);
            } else {
                this.showLandingPage();
            }
        }, 1500);

        // Simulate real-time updates
        this.startRealTimeUpdates();
    }

    loadMockData() {
        // Mock candidates data
        this.candidates = [
            {
                id: '1',
                name: 'Sarah Johnson',
                email: 'sarah.johnson@email.com',
                phone: '+1 (555) 123-4567',
                location: 'San Francisco, CA',
                position: 'Senior Software Engineer',
                experience: '5+ years',
                education: 'BS Computer Science, Stanford',
                skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
                score: 92,
                status: 'shortlisted',
                appliedDate: '2024-01-15',
                avatar: 'SJ',
                isShortlisted: true,
                linkedinId: 'sarah-johnson-dev',
                chatLink: 'https://hr-screener.com/chat?session=sess_001&candidate=1&name=Sarah Johnson&position=Senior Software Engineer',
                hasChatStarted: true,
                notes: [],
                tags: ['frontend', 'senior'],
                source: 'linkedin'
            },
            {
                id: '2',
                name: 'Michael Chen',
                email: 'michael.chen@email.com',
                phone: '+1 (555) 234-5678',
                location: 'Seattle, WA',
                position: 'Data Scientist',
                experience: '3+ years',
                education: 'MS Data Science, MIT',
                skills: ['Python', 'TensorFlow', 'SQL', 'R', 'Machine Learning'],
                score: 87,
                status: 'screening',
                appliedDate: '2024-01-14',
                avatar: 'MC',
                isShortlisted: false,
                linkedinId: 'michael-chen-ds',
                chatLink: 'https://hr-screener.com/chat?session=sess_002&candidate=2&name=Michael Chen&position=Data Scientist',
                hasChatStarted: true,
                notes: [],
                tags: ['ai', 'analytics'],
                source: 'website'
            },
            {
                id: '3',
                name: 'Emily Rodriguez',
                email: 'emily.rodriguez@email.com',
                phone: '+1 (555) 345-6789',
                location: 'Austin, TX',
                position: 'UX Designer',
                experience: '4+ years',
                education: 'BFA Design, ArtCenter',
                skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research'],
                score: 89,
                status: 'pending',
                appliedDate: '2024-01-13',
                avatar: 'ER',
                isShortlisted: false,
                linkedinId: 'emily-rodriguez-ux',
                chatLink: null,
                hasChatStarted: false,
                notes: [],
                tags: ['design', 'creative'],
                source: 'referral'
            },
            {
                id: '4',
                name: 'David Kim',
                email: 'david.kim@email.com',
                phone: '+1 (555) 456-7890',
                location: 'New York, NY',
                position: 'DevOps Engineer',
                experience: '6+ years',
                education: 'BS Computer Engineering, CMU',
                skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
                score: 94,
                status: 'hired',
                appliedDate: '2024-01-10',
                avatar: 'DK',
                isShortlisted: true,
                linkedinId: 'david-kim-devops',
                chatLink: 'https://hr-screener.com/chat?session=sess_004&candidate=4&name=David Kim&position=DevOps Engineer',
                hasChatStarted: true,
                notes: [],
                tags: ['devops', 'infrastructure'],
                source: 'job_board'
            },
            {
                id: '5',
                name: 'Amanda Thompson',
                email: 'amanda.thompson@email.com',
                phone: '+1 (555) 567-8901',
                location: 'Boston, MA',
                position: 'Product Manager',
                experience: '7+ years',
                education: 'MBA Harvard, BS Engineering',
                skills: ['Product Strategy', 'Agile', 'Analytics', 'Stakeholder Management'],
                score: 85,
                status: 'rejected',
                appliedDate: '2024-01-12',
                avatar: 'AT',
                isShortlisted: false,
                linkedinId: 'amanda-thompson-pm',
                chatLink: null,
                hasChatStarted: false,
                notes: [],
                tags: ['product', 'strategy'],
                source: 'website'
            }
        ];

        // Mock notifications
        this.notifications = [
            {
                id: '1',
                type: 'chat_link',
                title: 'Chat link generated',
                message: 'New screening chat link created for Sarah Johnson - Senior Software Engineer position',
                createdAt: new Date(Date.now() - 300000).toISOString(),
                isRead: false,
                candidateName: 'Sarah Johnson',
                candidateId: '1',
                actionUrl: 'https://hr-screener.com/chat?session=sess_001&candidate=1&name=Sarah Johnson&position=Senior Software Engineer',
                priority: 'medium'
            },
            {
                id: '2',
                type: 'screening',
                title: 'Chat session completed',
                message: 'Michael Chen has completed the AI screening interview with a score of 87%',
                createdAt: new Date(Date.now() - 1800000).toISOString(),
                isRead: false,
                candidateName: 'Michael Chen',
                candidateId: '2',
                priority: 'high'
            },
            {
                id: '3',
                type: 'upload',
                title: 'New resume uploaded',
                message: 'Emily Rodriguez submitted their resume for UX Designer position',
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                isRead: true,
                candidateName: 'Emily Rodriguez',
                candidateId: '3',
                priority: 'low'
            },
            {
                id: '4',
                type: 'application',
                title: 'Candidate hired',
                message: 'David Kim has been successfully hired for DevOps Engineer position',
                createdAt: new Date(Date.now() - 7200000).toISOString(),
                isRead: true,
                candidateName: 'David Kim',
                candidateId: '4',
                priority: 'high'
            }
        ];

        // Mock chat sessions
        this.chatSessions = [
            {
                id: 'sess_001',
                candidateId: '1',
                candidateName: 'Sarah Johnson',
                position: 'Senior Software Engineer',
                status: 'completed',
                startTime: new Date(Date.now() - 7200000).toISOString(),
                endTime: new Date(Date.now() - 5400000).toISOString(),
                finalScore: 92,
                isComplete: true,
                summary: 'Excellent technical knowledge and communication skills'
            },
            {
                id: 'sess_002',
                candidateId: '2',
                candidateName: 'Michael Chen',
                position: 'Data Scientist',
                status: 'active',
                startTime: new Date(Date.now() - 1800000).toISOString(),
                finalScore: null,
                isComplete: false,
                summary: null
            }
        ];

        // Set current user
        this.currentUser = {
            id: 'user_1',
            email: 'demo@company.com',
            name: 'John Demo',
            role: 'HR Manager',
            avatar: null,
            phone: '+1 (555) 999-0000',
            location: 'San Francisco, CA',
            department: 'Human Resources',
            bio: 'Experienced HR professional focused on talent acquisition and employee development.'
        };

        // Update UI with mock data
        this.updateMetrics();
        this.updateNotificationCount();
    }

    setupEventListeners() {
        // Landing page events
        document.getElementById('get-started-btn')?.addEventListener('click', () => {
            this.hideLandingPage();
            this.showLoginPage();
        });

        document.getElementById('landing-login-btn')?.addEventListener('click', () => {
            this.hideLandingPage();
            this.showLoginPage();
        });

        // Login form
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.dataset.view;
                this.navigateToView(view);
            });
        });

        // Action cards
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                if (view) {
                    this.navigateToView(view);
                }
            });
        });

        // Metric cards
        document.querySelectorAll('.metric-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                if (filter) {
                    this.setCandidateFilter(filter);
                    this.navigateToView('candidates');
                }
            });
        });

        // Sidebar toggle
        document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Search
        document.getElementById('global-search')?.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.debounceSearch();
        });

        document.getElementById('candidate-search')?.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.filterCandidates();
        });

        // Notifications
        document.getElementById('notifications-btn')?.addEventListener('click', () => {
            this.toggleNotifications();
        });

        document.getElementById('mark-all-read')?.addEventListener('click', () => {
            this.markAllNotificationsRead();
        });

        // User menu
        document.getElementById('user-btn')?.addEventListener('click', () => {
            this.toggleUserMenu();
        });

        document.getElementById('logout-btn')?.addEventListener('click', () => {
            this.handleLogout();
        });

        // Refresh button
        document.getElementById('refresh-btn')?.addEventListener('click', () => {
            this.refreshData();
        });

        // Demo button
        document.getElementById('demo-btn')?.addEventListener('click', () => {
            window.open(`${window.location.origin}${window.location.pathname}?demo=chat`, '_blank');
        });

        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setCandidateFilter(filter);
            });
        });

        // Settings tabs
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.showSettingsTab(tabName);
            });
        });

        // File upload
        document.getElementById('file-input')?.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });

        // Drag and drop
        const uploadArea = document.getElementById('upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                this.handleFileUpload(e.dataTransfer.files);
            });
        }

        // Chat links actions
        document.getElementById('generate-bulk-links')?.addEventListener('click', () => {
            this.generateBulkChatLinks();
        });

        document.getElementById('export-links')?.addEventListener('click', () => {
            this.exportChatLinks();
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notifications-dropdown')) {
                this.hideNotifications();
            }
            if (!e.target.closest('.user-dropdown')) {
                this.hideUserMenu();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        document.getElementById('global-search')?.focus();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.refreshData();
                        break;
                }
            }
        });

        // Menu item clicks
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                if (view) {
                    e.preventDefault();
                    this.navigateToView(view);
                    this.hideUserMenu();
                }
            });
        });
    }

    // Authentication methods
    handleLogin() {
        const form = document.getElementById('login-form');
        const email = form.email.value;
        const password = form.password.value;
        const rememberMe = form.rememberMe.checked;

        this.showLoginLoading(true);
        this.hideLoginError();

        // Simulate authentication delay
        setTimeout(() => {
            // Check demo credentials
            if (email === 'demo@company.com' && password === 'demo123') {
                this.handleAuthentication(true);
                if (rememberMe) {
                    localStorage.setItem('hr_token', 'demo_token_123');
                }
            } else {
                this.showLoginError('Invalid credentials. Please use demo@company.com / demo123');
            }
            this.showLoginLoading(false);
        }, 1500);
    }

    handleAuthentication(success) {
        if (success) {
            this.isAuthenticated = true;
            this.hideLoginPage();
            this.showDashboard();
            this.updateUserInfo();
            this.loadDashboardData();
        }
    }

    handleLogout() {
        localStorage.removeItem('hr_token');
        this.isAuthenticated = false;
        this.currentUser = null;
        this.hideDashboard();
        this.showLandingPage();
        this.hideUserMenu();
    }

    // Navigation methods
    navigateToView(viewName) {
        // Hide all views
        document.querySelectorAll('.view-content').forEach(view => {
            view.classList.remove('active');
        });

        // Show target view
        const targetView = document.getElementById(`view-${viewName}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-view="${viewName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        this.activeView = viewName;

        // Load view-specific data
        this.loadViewData(viewName);
    }

    loadViewData(viewName) {
        switch (viewName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'candidates':
                this.loadCandidatesData();
                break;
            case 'upload':
                this.resetUploadForm();
                break;
            case 'chat':
                this.loadChatData();
                break;
            case 'chatlinks':
                this.loadChatLinksData();
                break;
            case 'settings':
                this.loadSettingsData();
                break;
            case 'profile':
                this.loadProfileData();
                break;
        }
    }

    // Dashboard methods
    loadDashboardData() {
        this.updateMetrics();
        this.loadRecentActivity();
        this.updateDatabaseStatus();
    }

    updateMetrics() {
        // Update metric displays
        document.getElementById('metric-total').textContent = this.metrics.totalCandidates;
        document.getElementById('metric-pending').textContent = this.metrics.pending;
        document.getElementById('metric-screening').textContent = this.metrics.screening;
        document.getElementById('metric-shortlisted').textContent = this.metrics.shortlisted;
        document.getElementById('metric-hired').textContent = this.metrics.hired;
        document.getElementById('metric-score').textContent = `${this.metrics.averageScore}%`;

        // Update status alerts
        document.getElementById('total-candidates').textContent = this.metrics.totalCandidates;
        
        // Update chat links count
        const activeChatLinks = this.candidates.filter(c => c.chatLink).length;
        document.getElementById('active-links-count').textContent = activeChatLinks;
        document.getElementById('chatlinks-badge').textContent = activeChatLinks;
        
        if (activeChatLinks > 0) {
            document.getElementById('chatlinks-alert').classList.remove('hidden');
        } else {
            document.getElementById('chatlinks-alert').classList.add('hidden');
        }
    }

    loadRecentActivity() {
        const activityList = document.getElementById('recent-activity-list');
        if (!activityList) return;

        const activities = [
            {
                icon: 'user-plus',
                title: 'New candidate applied',
                description: 'Emily Rodriguez applied for UX Designer position',
                time: '2 hours ago'
            },
            {
                icon: 'message-circle',
                title: 'Chat session completed',
                description: 'Michael Chen finished AI screening interview',
                time: '4 hours ago'
            },
            {
                icon: 'check-circle',
                title: 'Candidate shortlisted',
                description: 'Sarah Johnson moved to shortlist',
                time: '6 hours ago'
            },
            {
                icon: 'upload',
                title: 'Resume analyzed',
                description: 'AI analysis completed for David Kim',
                time: '1 day ago'
            }
        ];

        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i data-lucide="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');

        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Candidates methods
    loadCandidatesData() {
        this.filterCandidates();
    }

    setCandidateFilter(filter) {
        this.candidateFilter = filter;
        
        // Update filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelector(`[data-filter="${filter}"]`)?.classList.add('active');
        
        // Update candidate filter badge
        const badge = document.getElementById('candidate-filter-badge');
        if (filter !== 'all') {
            badge.textContent = filter;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
        
        this.filterCandidates();
    }

    filterCandidates() {
        let filteredCandidates = this.candidates;

        // Apply status filter
        if (this.candidateFilter !== 'all') {
            filteredCandidates = filteredCandidates.filter(c => c.status === this.candidateFilter);
        }

        // Apply search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filteredCandidates = filteredCandidates.filter(c => 
                c.name.toLowerCase().includes(query) ||
                c.position.toLowerCase().includes(query) ||
                c.skills.some(skill => skill.toLowerCase().includes(query)) ||
                c.email.toLowerCase().includes(query)
            );
        }

        this.renderCandidates(filteredCandidates);
    }

    renderCandidates(candidates) {
        const candidatesList = document.getElementById('candidates-list');
        if (!candidatesList) return;

        candidatesList.innerHTML = candidates.map(candidate => `
            <div class="candidate-card" data-candidate-id="${candidate.id}">
                <div class="candidate-header">
                    <div class="candidate-info">
                        <div class="candidate-avatar">${candidate.avatar}</div>
                        <div class="candidate-details">
                            
                            <h3>${candidate.name}</h3>
                            <div class="candidate-position">${candidate.position}</div>
                            <div class="candidate-meta">
                                <span><i data-lucide="mail"></i> ${candidate.email}</span>
                                <span><i data-lucide="phone"></i> ${candidate.phone}</span>
                                <span><i data-lucide="map-pin"></i> ${candidate.location}</span>
                                <span><i data-lucide="calendar"></i> Applied ${this.formatDate(candidate.appliedDate)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="candidate-actions">
                        <div class="candidate-status ${candidate.status}">${candidate.status}</div>
                        <div class="candidate-score">${candidate.score}%</div>
                    </div>
                </div>
                
                <div class="candidate-skills">
                    ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                
                <div class="candidate-actions-bottom">
                    <div class="action-buttons">
                        <button class="action-btn" onclick="hrDashboard.viewResume('${candidate.id}')">
                            <i data-lucide="file-text"></i>
                            View Resume
                        </button>
                        ${candidate.chatLink ? `
                            <button class="action-btn secondary" onclick="hrDashboard.copyChatLink('${candidate.id}')">
                                <i data-lucide="copy"></i>
                                Copy Chat Link
                            </button>
                            <button class="action-btn secondary" onclick="window.open('${candidate.chatLink}', '_blank')">
                                <i data-lucide="external-link"></i>
                                Test Chat
                            </button>
                        ` : `
                            <button class="action-btn" onclick="hrDashboard.generateChatLink('${candidate.id}')">
                                <i data-lucide="link"></i>
                                Generate Chat Link
                            </button>
                        `}
                    </div>
                    
                    <div class="status-actions">
                        <select onchange="hrDashboard.updateCandidateStatus('${candidate.id}', this.value)" class="status-select">
                            <option value="pending" ${candidate.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="screening" ${candidate.status === 'screening' ? 'selected' : ''}>Screening</option>
                            <option value="shortlisted" ${candidate.status === 'shortlisted' ? 'selected' : ''}>Shortlisted</option>
                            <option value="rejected" ${candidate.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                            <option value="hired" ${candidate.status === 'hired' ? 'selected' : ''}>Hired</option>
                        </select>
                    </div>
                </div>
            </div>
        `).join('');

        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    updateCandidateStatus(candidateId, newStatus) {
        const candidate = this.candidates.find(c => c.id === candidateId);
        if (candidate) {
            const oldStatus = candidate.status;
            candidate.status = newStatus;
            candidate.isShortlisted = newStatus === 'shortlisted';

            // Update metrics
            if (this.metrics[oldStatus] !== undefined) {
                this.metrics[oldStatus]--;
            }
            if (this.metrics[newStatus] !== undefined) {
                this.metrics[newStatus]++;
            }

            this.updateMetrics();
            this.filterCandidates();

            // Add notification
            this.addNotification({
                type: 'application',
                title: 'Candidate status updated',
                message: `${candidate.name} status changed to ${newStatus}`,
                candidateName: candidate.name,
                candidateId: candidateId
            });
        }
    }

    generateChatLink(candidateId) {
        const candidate = this.candidates.find(c => c.id === candidateId);
        if (candidate) {
            const sessionId = `session_${candidateId}_${Date.now()}`;
            const chatLink = `${window.location.origin}${window.location.pathname}?session=${sessionId}&candidate=${candidateId}&name=${encodeURIComponent(candidate.name)}&position=${encodeURIComponent(candidate.position)}`;
            
            candidate.chatLink = chatLink;
            candidate.chatSessionId = sessionId;
            
            this.updateMetrics();
            this.filterCandidates();

            // Add notification
            this.addNotification({
                type: 'chat_link',
                title: 'Chat link generated',
                message: `New screening chat link created for ${candidate.name} - ${candidate.position} position`,
                candidateName: candidate.name,
                candidateId: candidateId,
                actionUrl: chatLink
            });

            // Show success message
            this.showToast('Chat link generated successfully!', 'success');
        }
    }

    copyChatLink(candidateId) {
        const candidate = this.candidates.find(c => c.id === candidateId);
        if (candidate && candidate.chatLink) {
            navigator.clipboard.writeText(candidate.chatLink).then(() => {
                this.showToast('Chat link copied to clipboard!', 'success');
            }).catch(() => {
                this.showToast('Failed to copy chat link', 'error');
            });
        }
    }

    viewResume(candidateId) {
        const candidate = this.candidates.find(c => c.id === candidateId);
        if (candidate) {
            this.selectedCandidate = candidate;
            this.navigateToView('viewer');
            this.loadResumeViewer(candidate);
        }
    }

    // File upload methods
    handleFileUpload(files) {
        if (files.length === 0) return;

        const file = files[0];
        
        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            this.showToast('Please upload a PDF or Word document', 'error');
            return;
        }

        // Show progress
        this.showUploadProgress();
        
        // Simulate upload process
        this.simulateUploadProgress().then(() => {
            this.processResumeFile(file);
        });
    }

    showUploadProgress() {
        document.getElementById('upload-area').style.display = 'none';
        document.getElementById('upload-progress').classList.remove('hidden');
    }

    simulateUploadProgress() {
        return new Promise((resolve) => {
            const progressFill = document.getElementById('progress-fill');
            const progressPercent = document.getElementById('progress-percent');
            const progressStatus = document.getElementById('progress-status');
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 100) progress = 100;
                
                progressFill.style.width = `${progress}%`;
                progressPercent.textContent = `${Math.round(progress)}%`;
                
                if (progress < 30) {
                    progressStatus.textContent = 'Uploading file...';
                } else if (progress < 60) {
                    progressStatus.textContent = 'Analyzing resume...';
                } else if (progress < 90) {
                    progressStatus.textContent = 'Extracting information...';
                } else {
                    progressStatus.textContent = 'Finalizing...';
                }
                
                if (progress >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 200);
        });
    }

    processResumeFile(file) {
        // Simulate AI processing
        setTimeout(() => {
            const newCandidate = this.generateCandidateFromFile(file);
            this.candidates.unshift(newCandidate);
            
            // Update metrics
            this.metrics.totalCandidates++;
            this.metrics.pending++;
            
            this.updateMetrics();
            this.showUploadResults(newCandidate);
            
            // Add notification
            this.addNotification({
                type: 'upload',
                title: 'Resume uploaded successfully',
                message: `New resume uploaded for ${newCandidate.name} - ${newCandidate.position} position`,
                candidateName: newCandidate.name,
                candidateId: newCandidate.id
            });
        }, 1000);
    }

    generateCandidateFromFile(file) {
        // Mock candidate generation from file
        const names = ['Alex Johnson', 'Maria Garcia', 'James Wilson', 'Lisa Anderson', 'Robert Taylor'];
        const positions = ['Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer', 'Marketing Manager'];
        const skills = [
            ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML'],
            ['Product Strategy', 'Agile', 'Scrum', 'Analytics', 'Roadmapping'],
            ['SQL', 'Python', 'Tableau', 'Excel', 'Statistics'],
            ['Figma', 'Sketch', 'Prototyping', 'User Research', 'Wireframing'],
            ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Social Media']
        ];

        const randomIndex = Math.floor(Math.random() * names.length);
        const name = names[randomIndex];
        const position = positions[randomIndex];
        const candidateSkills = skills[randomIndex];

        return {
            id: `candidate_${Date.now()}`,
            name: name,
            email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
            phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            location: 'Remote',
            position: position,
            experience: `${Math.floor(Math.random() * 8) + 1}+ years`,
            education: 'Bachelor\'s Degree',
            skills: candidateSkills,
            score: Math.floor(Math.random() * 20) + 75,
            status: 'pending',
            appliedDate: new Date().toISOString().split('T')[0],
            avatar: name.split(' ').map(n => n[0]).join(''),
            isShortlisted: false,
            linkedinId: name.toLowerCase().replace(' ', '-'),
            chatLink: null,
            hasChatStarted: false,
            notes: [],
            tags: [],
            source: 'website',
            resumeFileName: file.name
        };
    }

    showUploadResults(candidate) {
        document.getElementById('upload-progress').classList.add('hidden');
        
        const resultsDiv = document.getElementById('upload-results');
        resultsDiv.innerHTML = `
            <div class="upload-success">
                <div class="success-header">
                    <i data-lucide="check-circle" style="color: var(--success); width: 48px; height: 48px;"></i>
                    <h3>Resume Processed Successfully!</h3>
                </div>
                
                <div class="candidate-preview">
                    <div class="preview-header">
                        <div class="candidate-avatar">${candidate.avatar}</div>
                        <div>
                            <h4>${candidate.name}</h4>
                            <p>${candidate.position}</p>
                            <div class="candidate-score">AI Score: ${candidate.score}%</div>
                        </div>
                    </div>
                    
                    <div class="extracted-info">
                        <h5>Extracted Information:</h5>
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>Email:</strong> ${candidate.email}
                            </div>
                            <div class="info-item">
                                <strong>Experience:</strong> ${candidate.experience}
                            </div>
                            <div class="info-item">
                                <strong>Education:</strong> ${candidate.education}
                            </div>
                        </div>
                        
                        <div class="skills-preview">
                            <strong>Skills:</strong>
                            <div class="skills-list">
                                ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="result-actions">
                        <button class="action-btn" onclick="hrDashboard.navigateToView('candidates')">
                            <i data-lucide="users"></i>
                            View in Candidates
                        </button>
                        <button class="action-btn" onclick="hrDashboard.generateChatLink('${candidate.id}')">
                            <i data-lucide="link"></i>
                            Generate Chat Link
                        </button>
                        <button class="action-btn secondary" onclick="hrDashboard.resetUploadForm()">
                            <i data-lucide="upload"></i>
                            Upload Another
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        resultsDiv.classList.remove('hidden');
        
        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    resetUploadForm() {
        document.getElementById('upload-area').style.display = 'block';
        document.getElementById('upload-progress').classList.add('hidden');
        document.getElementById('upload-results').classList.add('hidden');
        document.getElementById('file-input').value = '';
    }

    // Chat methods
    loadChatData() {
        this.renderChatSessions();
    }

    renderChatSessions() {
        const sessionsContainer = document.getElementById('chat-sessions');
        if (!sessionsContainer) return;

        sessionsContainer.innerHTML = this.chatSessions.map(session => `
            <div class="chat-session-item" data-session-id="${session.id}" onclick="hrDashboard.openChatSession('${session.id}')">
                <div class="session-name">${session.candidateName}</div>
                <div class="session-status">${session.status} - ${session.position}</div>
            </div>
        `).join('');
    }

    openChatSession(sessionId) {
        const session = this.chatSessions.find(s => s.id === sessionId);
        if (session) {
            // Update active session
            document.querySelectorAll('.chat-session-item').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector(`[data-session-id="${sessionId}"]`).classList.add('active');

            // Show chat interface
            document.getElementById('chat-placeholder').classList.add('hidden');
            document.getElementById('chat-interface').classList.remove('hidden');

            // Update chat header
            document.getElementById('chat-candidate-name').textContent = session.candidateName;
            document.getElementById('chat-candidate-position').textContent = session.position;

            // Load chat messages
            this.loadChatMessages(sessionId);
        }
    }

    loadChatMessages(sessionId) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        // Mock chat messages
        const messages = [
            {
                type: 'ai',
                content: 'Hello! Welcome to the AI screening interview. I\'ll be asking you some questions about your experience and skills. Are you ready to begin?',
                time: '10:30 AM'
            },
            {
                type: 'user',
                content: 'Yes, I\'m ready. Thank you for this opportunity.',
                time: '10:31 AM'
            },
            {
                type: 'ai',
                content: 'Great! Let\'s start with your background. Can you tell me about your experience with JavaScript and React?',
                time: '10:31 AM'
            },
            {
                type: 'user',
                content: 'I have over 5 years of experience with JavaScript and have been working with React for the past 3 years. I\'ve built several large-scale applications using React, Redux, and modern development practices.',
                time: '10:32 AM'
            }
        ];

        messagesContainer.innerHTML = messages.map(message => `
            <div class="message ${message.type}">
                ${message.type === 'ai' ? '<div class="message-avatar">AI</div>' : ''}
                <div class="message-content">
                    ${message.content}
                    <div class="message-time">${message.time}</div>
                </div>
                ${message.type === 'user' ? '<div class="message-avatar">U</div>' : ''}
            </div>
        `).join('');
    }

    // Chat Links methods
    loadChatLinksData() {
        this.renderChatLinks();
    }

    renderChatLinks() {
        const chatLinksContainer = document.getElementById('chatlinks-list');
        if (!chatLinksContainer) return;

        const candidatesWithLinks = this.candidates.filter(c => c.chatLink);

        chatLinksContainer.innerHTML = candidatesWithLinks.map(candidate => `
            <div class="chatlink-card">
                <div class="chatlink-header">
                    <div class="chatlink-candidate">
                        <div class="candidate-avatar">${candidate.avatar}</div>
                        <div class="chatlink-details">
                            <h3>${candidate.name}</h3>
                            <div class="chatlink-position">${candidate.position}</div>
                        </div>
                    </div>
                    <div class="chatlink-actions">
                        <button class="action-btn secondary" onclick="hrDashboard.copyChatLink('${candidate.id}')">
                            <i data-lucide="copy"></i>
                            Copy
                        </button>
                        <button class="action-btn secondary" onclick="window.open('${candidate.chatLink}', '_blank')">
                            <i data-lucide="external-link"></i>
                            Test
                        </button>
                    </div>
                </div>
                
                <div class="chatlink-url">${candidate.chatLink}</div>
                
                <div class="chatlink-stats">
                    <span><i data-lucide="calendar"></i> Generated ${this.formatDate(candidate.appliedDate)}</span>
                    <span><i data-lucide="activity"></i> ${candidate.hasChatStarted ? 'Used' : 'Not used'}</span>
                    <span><i data-lucide="clock"></i> ${candidate.status}</span>
                </div>
            </div>
        `).join('');

        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    generateBulkChatLinks() {
        const pendingCandidates = this.candidates.filter(c => c.status === 'pending' && !c.chatLink);
        
        pendingCandidates.forEach(candidate => {
            this.generateChatLink(candidate.id);
        });

        this.showToast(`Generated ${pendingCandidates.length} chat links`, 'success');
        this.renderChatLinks();
    }

    exportChatLinks() {
        const candidatesWithLinks = this.candidates.filter(c => c.chatLink);
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Name,Position,Email,Chat Link,Status\n"
            + candidatesWithLinks.map(c => 
                `"${c.name}","${c.position}","${c.email}","${c.chatLink}","${c.status}"`
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "chat_links.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showToast('Chat links exported successfully', 'success');
    }

    // Resume Viewer methods
    loadResumeViewer(candidate) {
        const viewerPlaceholder = document.getElementById('viewer-placeholder');
        const resumeViewer = document.getElementById('resume-viewer');

        if (candidate) {
            viewerPlaceholder.classList.add('hidden');
            resumeViewer.classList.remove('hidden');
            
            resumeViewer.innerHTML = `
                <div class="resume-header">
                    <div class="resume-candidate-info">
                        <div class="candidate-avatar large">${candidate.avatar}</div>
                        <div class="candidate-details">
                            <h2>${candidate.name}</h2>
                            <h3>${candidate.position}</h3>
                            <div class="candidate-meta">
                                <span><i data-lucide="mail"></i> ${candidate.email}</span>
                                <span><i data-lucide="phone"></i> ${candidate.phone}</span>
                                <span><i data-lucide="map-pin"></i> ${candidate.location}</span>
                            </div>
                        </div>
                    </div>
                    <div class="resume-actions">
                        <button class="action-btn">
                            <i data-lucide="download"></i>
                            Download PDF
                        </button>
                        <button class="action-btn secondary">
                            <i data-lucide="printer"></i>
                            Print
                        </button>
                    </div>
                </div>
                
                <div class="resume-content">
                    <div class="resume-section">
                        <h4>Summary</h4>
                        <p>Experienced ${candidate.position.toLowerCase()} with ${candidate.experience} of industry experience. Proven track record of delivering high-quality solutions and working effectively in team environments.</p>
                    </div>
                    
                    <div class="resume-section">
                        <h4>Skills</h4>
                        <div class="skills-grid">
                            ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="resume-section">
                        <h4>Experience</h4>
                        <div class="experience-item">
                            <h5>Senior Developer - Tech Company</h5>
                            <div class="experience-period">2020 - Present</div>
                            <p>Led development of multiple web applications using modern technologies. Collaborated with cross-functional teams to deliver projects on time and within budget.</p>
                        </div>
                    </div>
                    
                    <div class="resume-section">
                        <h4>Education</h4>
                        <div class="education-item">
                            <h5>${candidate.education}</h5>
                            <div class="education-period">2016 - 2020</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            viewerPlaceholder.classList.remove('hidden');
            resumeViewer.classList.add('hidden');
        }

        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Settings methods
    loadSettingsData() {
        // Settings data is already in the HTML
    }

    showSettingsTab(tabName) {
        // Hide all panels
        document.querySelectorAll('.settings-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Show target panel
        document.getElementById(`settings-${tabName}`).classList.add('active');

        // Update tabs
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }

    // Profile methods
    loadProfileData() {
        if (this.currentUser) {
            // Update profile form with current user data
            document.querySelector('#view-profile input[type="text"]').value = this.currentUser.name.split(' ')[0];
            document.querySelector('#view-profile input[type="email"]').value = this.currentUser.email;
        }
    }

    // Notification methods
    addNotification(notification) {
        const newNotification = {
            id: `notif_${Date.now()}`,
            createdAt: new Date().toISOString(),
            isRead: false,
            ...notification
        };

        this.notifications.unshift(newNotification);
        this.updateNotificationCount();
        this.renderNotifications();
    }

    updateNotificationCount() {
        const unreadCount = this.notifications.filter(n => !n.isRead).length;
        const countElement = document.getElementById('notification-count');
        const unreadElement = document.getElementById('unread-count');

        if (unreadCount > 0) {
            countElement.textContent = unreadCount > 9 ? '9+' : unreadCount;
            countElement.classList.remove('hidden');
        } else {
            countElement.classList.add('hidden');
        }

        if (unreadElement) {
            unreadElement.textContent = unreadCount;
        }
    }

    renderNotifications() {
        const notificationsList = document.getElementById('notifications-list');
        if (!notificationsList) return;

        if (this.notifications.length === 0) {
            notificationsList.innerHTML = `
                <div class="empty-notifications">
                    <i data-lucide="bell" style="width: 48px; height: 48px; opacity: 0.5; margin-bottom: 16px;"></i>
                    <p>No notifications</p>
                </div>
            `;
        } else {
            notificationsList.innerHTML = this.notifications.map(notification => `
                <div class="notification-item ${!notification.isRead ? 'unread' : ''}" onclick="hrDashboard.handleNotificationClick('${notification.id}')">
                    <div class="notification-content">
                        <div class="notification-icon">
                            <i data-lucide="${this.getNotificationIcon(notification.type)}"></i>
                        </div>
                        <div class="notification-text">
                            <div class="notification-title">${notification.title}</div>
                            <div class="notification-message">${notification.message}</div>
                            <div class="notification-time">${this.getTimeAgo(notification.createdAt)}</div>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    getNotificationIcon(type) {
        const icons = {
            'application': 'user-plus',
            'screening': 'check-circle',
            'interview': 'calendar',
            'upload': 'upload',
            'analysis': 'alert-circle',
            'chat_link': 'link'
        };
        return icons[type] || 'bell';
    }

    handleNotificationClick(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;

        // Mark as read
        if (!notification.isRead) {
            notification.isRead = true;
            this.updateNotificationCount();
            this.renderNotifications();
        }

        // Navigate based on notification type
        switch (notification.type) {
            case 'application':
            case 'upload':
                this.navigateToView('candidates');
                break;
            case 'chat_link':
                this.navigateToView('chatlinks');
                break;
            case 'screening':
                this.navigateToView('chat');
                break;
            default:
                this.navigateToView('dashboard');
        }

        this.hideNotifications();
    }

    markAllNotificationsRead() {
        this.notifications.forEach(n => n.isRead = true);
        this.updateNotificationCount();
        this.renderNotifications();
    }

    toggleNotifications() {
        const menu = document.getElementById('notifications-menu');
        menu.classList.toggle('hidden');
        
        if (!menu.classList.contains('hidden')) {
            this.renderNotifications();
        }
    }

    hideNotifications() {
        document.getElementById('notifications-menu').classList.add('hidden');
    }

    toggleUserMenu() {
        document.getElementById('user-menu').classList.toggle('hidden');
    }

    hideUserMenu() {
        document.getElementById('user-menu').classList.add('hidden');
    }

    // Utility methods
    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
    }

    updateUserInfo() {
        if (this.currentUser) {
            const initials = this.currentUser.name.split(' ').map(n => n[0]).join('');
            document.getElementById('user-initials').textContent = initials;
            document.getElementById('user-initials-large').textContent = initials;
            document.getElementById('user-name').textContent = this.currentUser.name;
            document.getElementById('user-role').textContent = this.currentUser.role;
        }
    }

    updateDatabaseStatus() {
        const statusElement = document.getElementById('db-status-text');
        const connectionStatus = document.getElementById('connection-status');
        
        if (this.dbStatus === 'connected') {
            statusElement.textContent = 'PostgreSQL';
            statusElement.style.color = 'var(--success)';
            connectionStatus.innerHTML = `
                <i data-lucide="activity"></i>
                <span>PostgreSQL Online</span>
            `;
            connectionStatus.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
            connectionStatus.style.color = 'var(--success)';
        } else {
            statusElement.textContent = 'Disconnected';
            statusElement.style.color = 'var(--destructive)';
            connectionStatus.innerHTML = `
                <i data-lucide="database"></i>
                <span>DB Offline</span>
            `;
            connectionStatus.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            connectionStatus.style.color = 'var(--destructive)';
        }

        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    refreshData() {
        const refreshBtn = document.getElementById('refresh-btn');
        refreshBtn.disabled = true;
        refreshBtn.classList.add('loading');

        // Simulate data refresh
        setTimeout(() => {
            this.loadDashboardData();
            this.filterCandidates();
            this.renderNotifications();
            
            refreshBtn.disabled = false;
            refreshBtn.classList.remove('loading');
            
            this.showToast('Data refreshed successfully', 'success');
        }, 1500);
    }

    startRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            if (this.isAuthenticated && Math.random() < 0.3) {
                this.simulateRealTimeUpdate();
            }
        }, 30000); // Every 30 seconds
    }

    simulateRealTimeUpdate() {
        const updateTypes = ['status_change', 'new_message', 'chat_started'];
        const updateType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
        
        switch (updateType) {
            case 'status_change':
                // Simulate a candidate status change
                const pendingCandidates = this.candidates.filter(c => c.status === 'pending');
                if (pendingCandidates.length > 0) {
                    const candidate = pendingCandidates[0];
                    this.updateCandidateStatus(candidate.id, 'screening');
                }
                break;
                
            case 'chat_started':
                // Simulate a chat session starting
                const candidatesWithLinks = this.candidates.filter(c => c.chatLink && !c.hasChatStarted);
                if (candidatesWithLinks.length > 0) {
                    const candidate = candidatesWithLinks[0];
                    candidate.hasChatStarted = true;
                    
                    this.addNotification({
                        type: 'screening',
                        title: 'Chat session started',
                        message: `${candidate.name} has started the AI screening interview`,
                        candidateName: candidate.name,
                        candidateId: candidate.id
                    });
                }
                break;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    }

    debounceSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.filterCandidates();
        }, 300);
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to document
        document.body.appendChild(toast);

        // Initialize icon
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    // Page visibility methods
    hideLoadingScreen() {
        document.getElementById('loading-screen').classList.add('hidden');
    }

    showLandingPage() {
        document.getElementById('landing-page').classList.remove('hidden');
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }

    hideLandingPage() {
        document.getElementById('landing-page').classList.add('hidden');
    }

    showLoginPage() {
        document.getElementById('login-page').classList.remove('hidden');
        document.getElementById('landing-page').classList.add('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }

    hideLoginPage() {
        document.getElementById('login-page').classList.add('hidden');
    }

    showDashboard() {
        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('landing-page').classList.add('hidden');
        document.getElementById('login-page').classList.add('hidden');
    }

    hideDashboard() {
        document.getElementById('dashboard').classList.add('hidden');
    }

    showLoginLoading(show) {
        const spinner = document.querySelector('.btn-spinner');
        const text = document.querySelector('.btn-text');
        const button = document.querySelector('.login-btn');
        
        if (show) {
            spinner.classList.remove('hidden');
            text.style.opacity = '0';
            button.disabled = true;
        } else {
            spinner.classList.add('hidden');
            text.style.opacity = '1';
            button.disabled = false;
        }
    }

    showLoginError(message) {
        const errorDiv = document.getElementById('login-error');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    hideLoginError() {
        document.getElementById('login-error').classList.add('hidden');
    }

    // Demo and candidate chat methods
    showDemoChat() {
        document.body.innerHTML = `
            <div class="demo-chat-container">
                <div class="demo-chat-header">
                    <h1>🤖 AI Screening Demo</h1>
                    <p>This is a demonstration of our AI-powered candidate screening system</p>
                </div>
                <div class="demo-chat-content">
                    <div class="demo-message">
                        <strong>AI:</strong> Welcome to the demo! This shows how candidates interact with our AI screening system.
                    </div>
                    <div class="demo-actions">
                        <button onclick="window.close()" class="demo-btn">Close Demo</button>
                        <button onclick="window.location.href = window.location.origin + window.location.pathname" class="demo-btn">Back to Dashboard</button>
                    </div>
                </div>
            </div>
            <style>
                .demo-chat-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
                    padding: 2rem;
                    text-align: center;
                }
                .demo-chat-header h1 {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    color: #141e30;
                }
                .demo-chat-content {
                    background: white;
                    padding: 2rem;
                    border-radius: 1rem;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    max-width: 500px;
                }
                .demo-message {
                    padding: 1rem;
                    background: #f0f4f8;
                    border-radius: 0.5rem;
                    margin-bottom: 2rem;
                }
                .demo-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                .demo-btn {
                    padding: 0.75rem 1.5rem;
                    background: #141e30;
                    color: white;
                    border: none;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 500;
                }
                .demo-btn:hover {
                    background: rgba(20, 30, 48, 0.9);
                }
            </style>
        `;
    }

    showCandidateChat(params) {
        document.body.innerHTML = `
            <div class="candidate-chat-container">
                <div class="candidate-chat-header">
                    <h1>🤖 AI Screening Interview</h1>
                    <div class="interview-info">
                        <p><strong>Candidate:</strong> ${params.candidateName}</p>
                        <p><strong>Position:</strong> ${params.position}</p>
                        <p><strong>Company:</strong> TechCorp</p>
                    </div>
                </div>
                <div class="candidate-chat-content">
                    <div class="chat-messages" id="candidate-chat-messages">
                        <div class="ai-message">
                            <strong>AI Interviewer:</strong> Hello ${params.candidateName}! Welcome to your AI screening interview for the ${params.position} position. I'll be asking you some questions to better understand your background and skills. Are you ready to begin?
                        </div>
                    </div>
                    <div class="chat-input-container">
                        <input type="text" id="candidate-chat-input" placeholder="Type your response..." />
                        <button onclick="candidateChat.sendMessage()" id="send-btn">Send</button>
                    </div>
                </div>
            </div>
            <style>
                .candidate-chat-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background: #f0f4f8;
                    font-family: 'Inter', sans-serif;
                }
                .candidate-chat-header {
                    background: #141e30;
                    color: white;
                    padding: 2rem;
                    text-align: center;
                }
                .candidate-chat-header h1 {
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                }
                .interview-info {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    font-size: 0.9rem;
                    opacity: 0.9;
                }
                .candidate-chat-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 2rem;
                    width: 100%;
                }
                .chat-messages {
                    flex: 1;
                    background: white;
                    border-radius: 1rem;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                    min-height: 400px;
                    overflow-y: auto;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                .ai-message, .user-message {
                    margin-bottom: 1rem;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    line-height: 1.5;
                }
                .ai-message {
                    background: #e2e8f0;
                    border-left: 4px solid #141e30;
                }
                .user-message {
                    background: #141e30;
                    color: white;
                    margin-left: 2rem;
                    text-align: right;
                }
                .chat-input-container {
                    display: flex;
                    gap: 1rem;
                    background: white;
                    padding: 1rem;
                    border-radius: 1rem;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                }
                #candidate-chat-input {
                    flex: 1;
                    padding: 0.75rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                }
                #send-btn {
                    padding: 0.75rem 1.5rem;
                    background: #141e30;
                    color: white;
                    border: none;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-weight: 500;
                }
                #send-btn:hover {
                    background: rgba(20, 30, 48, 0.9);
                }
                @media (max-width: 768px) {
                    .interview-info {
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                    .candidate-chat-content {
                        padding: 1rem;
                    }
                }
            </style>
            <script>
                const candidateChat = {
                    questions: [
                        "Can you tell me about your experience with the technologies mentioned in the job description?",
                        "Describe a challenging project you've worked on and how you overcame the difficulties.",
                        "How do you stay updated with the latest trends and technologies in your field?",
                        "What interests you most about this position and our company?",
                        "Where do you see yourself professionally in the next 3-5 years?"
                    ],
                    currentQuestion: 0,
                    responses: [],
                    
                    sendMessage() {
                        const input = document.getElementById('candidate-chat-input');
                        const message = input.value.trim();
                        
                        if (!message) return;
                        
                        // Add user message
                        this.addMessage(message, 'user');
                        input.value = '';
                        
                        // Store response
                        this.responses.push(message);
                        
                        // Send next question or finish
                        setTimeout(() => {
                            if (this.currentQuestion < this.questions.length) {
                                this.addMessage(this.questions[this.currentQuestion], 'ai');
                                this.currentQuestion++;
                            } else {
                                this.finishInterview();
                            }
                        }, 1000);
                    },
                    
                    addMessage(text, type) {
                        const messagesContainer = document.getElementById('candidate-chat-messages');
                        const messageDiv = document.createElement('div');
                        messageDiv.className = type + '-message';
                        messageDiv.innerHTML = type === 'ai' ? 
                            '<strong>AI Interviewer:</strong> ' + text : 
                            '<strong>You:</strong> ' + text;
                        messagesContainer.appendChild(messageDiv);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    },
                    
                    finishInterview() {
                        const score = Math.floor(Math.random() * 20) + 75;
                        this.addMessage(
                            'Thank you for completing the interview! Your responses have been recorded and analyzed. You will hear back from our HR team within 2-3 business days. Your interview score: ' + score + '%', 
                            'ai'
                        );
                        
                        setTimeout(() => {
                            alert('Interview completed! You can now close this window.');
                        }, 2000);
                    }
                };
                
                // Allow Enter key to send message
                document.getElementById('candidate-chat-input').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        candidateChat.sendMessage();
                    }
                });
                
                // Auto-focus input
                document.getElementById('candidate-chat-input').focus();
            </script>
        `;
    }
}

// Add toast styles to document
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 1rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform var(--transition-normal);
        max-width: 400px;
    }
    
    .toast.show {
        transform: translateX(0);
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }
    
    .toast-success {
        border-left: 4px solid var(--success);
    }
    
    .toast-error {
        border-left: 4px solid var(--destructive);
    }
    
    .toast-info {
        border-left: 4px solid var(--info);
    }
    
    .toast i {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
    }
    
    .toast-success i {
        color: var(--success);
    }
    
    .toast-error i {
        color: var(--destructive);
    }
    
    .toast-info i {
        color: var(--info);
    }
`;
document.head.appendChild(toastStyles);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hrDashboard = new HRDashboard();
});

// Make HRDashboard available globally for inline event handlers
window.HRDashboard = HRDashboard;