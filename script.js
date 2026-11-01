/**
 * ApexPortal Multi-Step Registration Engine
 * Features:
 * - Theme Switcher (Dark/Light with localStorage persistence)
 * - Multi-Step Wizard with Step Navigation & Progress Tracking
 * - Real-Time Form Validation & Error Highlighting
 * - Interactive Password Strength Meter & Live Requirement Checklist
 * - Drag-and-Drop File Upload with Image/Document Preview
 * - Simulated 4-Digit OTP Code Verification with Auto-Focus & Paste Support
 * - Auto-Age Calculation from Date of Birth
 * - Confetti Celebration Success Modal
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. THEME SWITCHER LOGIC
    // ==========================================
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeLabelText = document.getElementById('themeLabelText');
    const htmlElement = document.documentElement;

    const getStoredTheme = () => {
        const stored = localStorage.getItem('apex_portal_theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('apex_portal_theme', theme);
        if (themeLabelText) {
            themeLabelText.textContent = theme === 'dark' ? 'Dark' : 'Light';
        }
    };

    applyTheme(getStoredTheme());

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    }

    // ==========================================
    // 2. DOM ELEMENTS CACHE
    // ==========================================
    const form = document.getElementById('registrationForm');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const stepIndicators = [
        document.getElementById('stepIndicator1'),
        document.getElementById('stepIndicator2'),
        document.getElementById('stepIndicator3')
    ];
    const connectors = Array.from(document.querySelectorAll('.step-connector'));
    const globalProgressFill = document.getElementById('globalProgressFill');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    // Step 1 Inputs
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPasswordBtn');
    const meterFill = document.getElementById('meterFill');
    const meterStatus = document.getElementById('meterStatus');

    // Password Checklist Rules
    const ruleLength = document.getElementById('ruleLength');
    const ruleUpper = document.getElementById('ruleUpper');
    const ruleNumber = document.getElementById('ruleNumber');
    const ruleSpecial = document.getElementById('ruleSpecial');

    // Step 2 Inputs
    const countryCodeSelect = document.getElementById('countryCode');
    const phoneInput = document.getElementById('phone');
    const dobInput = document.getElementById('dob');
    const calculatedAgeInput = document.getElementById('calculatedAge');
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    const primaryRoleSelect = document.getElementById('primaryRole');
    const expSlider = document.getElementById('experienceYears');
    const expValDisplay = document.getElementById('expValDisplay');

    // File Dropzone
    const fileDropzone = document.getElementById('fileDropzone');
    const userFileInput = document.getElementById('userFile');
    const dropzoneEmpty = document.getElementById('dropzoneEmpty');
    const dropzonePreview = document.getElementById('dropzonePreview');
    const previewThumb = document.getElementById('previewThumb');
    const previewFileName = document.getElementById('previewFileName');
    const previewFileSize = document.getElementById('previewFileSize');
    const removeFileBtn = document.getElementById('removeFileBtn');

    // Step 3 Inputs
    const otpTargetEmail = document.getElementById('otpTargetEmail');
    const demoOtpCodeDisplay = document.getElementById('demoOtpCodeDisplay');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const otpInputs = [
        document.getElementById('otp1'),
        document.getElementById('otp2'),
        document.getElementById('otp3'),
        document.getElementById('otp4')
    ];
    const termsConsent = document.getElementById('termsConsent');

    // Summary Review
    const summaryName = document.getElementById('summaryName');
    const summaryEmail = document.getElementById('summaryEmail');
    const summaryPhone = document.getElementById('summaryPhone');
    const summaryDomain = document.getElementById('summaryDomain');

    // Success Modal
    const successModal = document.getElementById('successModal');
    const registeredUserEmail = document.getElementById('registeredUserEmail');
    const registeredUserName = document.getElementById('registeredUserName');
    const registeredUserRole = document.getElementById('registeredUserRole');
    const modalContinueBtn = document.getElementById('modalContinueBtn');
    const confettiContainer = document.getElementById('confettiContainer');

    // State Variables
    let currentStep = 1;
    let expectedOtp = '8492';
    let uploadedFile = null;

    // ==========================================
    // 3. STEPPER WIZARD CONTROLLER
    // ==========================================
    const updateWizardUI = () => {
        // Toggle step sections
        steps.forEach((step, idx) => {
            const stepNum = idx + 1;
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update step badges & connectors
        stepIndicators.forEach((indicator, idx) => {
            const stepNum = idx + 1;
            indicator.classList.remove('active', 'completed');

            if (stepNum === currentStep) {
                indicator.classList.add('active');
            } else if (stepNum < currentStep) {
                indicator.classList.add('completed');
                indicator.classList.add('clickable');
            }
        });

        connectors.forEach((conn, idx) => {
            if (idx + 1 < currentStep) {
                conn.classList.add('filled');
            } else {
                conn.classList.remove('filled');
            }
        });

        // Update progress bar percentage
        const progressPercentages = { 1: 33, 2: 66, 3: 100 };
        if (globalProgressFill) {
            globalProgressFill.style.width = `${progressPercentages[currentStep]}%`;
        }

        // Action button states
        prevBtn.disabled = currentStep === 1;

        if (currentStep === 3) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
            updateSummaryCard();
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }

        // Scroll top smoothly into wizard
        const wizardCard = document.querySelector('.wizard-card');
        if (wizardCard) {
            wizardCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    // Allow clicking on completed steps
    stepIndicators.forEach((indicator, idx) => {
        indicator.addEventListener('click', () => {
            const targetStep = idx + 1;
            if (targetStep < currentStep) {
                currentStep = targetStep;
                updateWizardUI();
            }
        });
    });

    // ==========================================
    // 4. VALIDATION HELPERS
    // ==========================================
    const setFieldError = (inputElement, errorElementId, isError, customMsg) => {
        const group = inputElement ? inputElement.closest('.input-field-group') : null;
        const errorEl = document.getElementById(errorElementId);

        if (isError) {
            if (group) group.classList.add('has-error');
            if (errorEl) {
                if (customMsg) errorEl.textContent = customMsg;
                errorEl.style.display = 'block';
            }
            if (inputElement && typeof inputElement.focus === 'function' && document.activeElement !== inputElement) {
                inputElement.focus();
            }
            return false;
        } else {
            if (group) group.classList.remove('has-error');
            if (errorEl) {
                errorEl.style.display = 'none';
            }
            return true;
        }
    };

    // Email Regex Pattern
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailRegex.test(String(email).trim());
    };

    // ==========================================
    // 5. STEP 1 VALIDATION & PASSWORD STRENGTH
    // ==========================================
    const evaluatePassword = (pwd) => {
        const rules = {
            length: pwd.length >= 8,
            upper: /[A-Z]/.test(pwd),
            number: /[0-9]/.test(pwd),
            special: /[\W_]/.test(pwd)
        };

        // Update Rule Items
        const updateRule = (element, passed) => {
            if (!element) return;
            const icon = element.querySelector('.rule-icon');
            if (passed) {
                element.classList.add('valid');
                if (icon) icon.textContent = '✓';
            } else {
                element.classList.remove('valid');
                if (icon) icon.textContent = '○';
            }
        };

        updateRule(ruleLength, rules.length);
        updateRule(ruleUpper, rules.upper);
        updateRule(ruleNumber, rules.number);
        updateRule(ruleSpecial, rules.special);

        const passedCount = Object.values(rules).filter(Boolean).length;
        let meterWidth = '0%';
        let meterColor = 'var(--danger)';
        let statusText = 'Too short';

        if (pwd.length === 0) {
            meterWidth = '0%';
            statusText = 'None';
        } else if (passedCount === 1) {
            meterWidth = '25%';
            meterColor = 'var(--danger)';
            statusText = 'Weak';
        } else if (passedCount === 2) {
            meterWidth = '50%';
            meterColor = 'var(--warning)';
            statusText = 'Fair';
        } else if (passedCount === 3) {
            meterWidth = '75%';
            meterColor = '#3b82f6';
            statusText = 'Good';
        } else if (passedCount === 4) {
            meterWidth = '100%';
            meterColor = 'var(--success)';
            statusText = 'Strong';
        }

        if (meterFill) {
            meterFill.style.width = meterWidth;
            meterFill.style.backgroundColor = meterColor;
        }
        if (meterStatus) {
            meterStatus.textContent = statusText;
            meterStatus.style.color = meterColor;
        }

        return passedCount === 4;
    };

    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            evaluatePassword(passwordInput.value);
            if (confirmPasswordInput.value.length > 0) {
                setFieldError(
                    confirmPasswordInput,
                    'confirmPasswordError',
                    confirmPasswordInput.value !== passwordInput.value
                );
            }
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', () => {
            setFieldError(
                confirmPasswordInput,
                'confirmPasswordError',
                confirmPasswordInput.value !== passwordInput.value
            );
        });
    }

    // Toggle Password Visibility
    const setupPasswordToggle = (toggleBtn, targetInput) => {
        if (!toggleBtn || !targetInput) return;
        toggleBtn.addEventListener('click', () => {
            const isPassword = targetInput.type === 'password';
            targetInput.type = isPassword ? 'text' : 'password';

            const eyeOpen = toggleBtn.querySelector('.eye-open');
            const eyeClosed = toggleBtn.querySelector('.eye-closed');

            if (eyeOpen && eyeClosed) {
                eyeOpen.classList.toggle('hidden', isPassword);
                eyeClosed.classList.toggle('hidden', !isPassword);
            }
        });
    };

    setupPasswordToggle(togglePasswordBtn, passwordInput);
    setupPasswordToggle(toggleConfirmPasswordBtn, confirmPasswordInput);

    const validateStep1 = () => {
        let isValid = true;

        // Full Name
        if (!fullNameInput.value.trim() || fullNameInput.value.trim().length < 3) {
            setFieldError(fullNameInput, 'fullNameError', true);
            isValid = false;
        } else {
            setFieldError(fullNameInput, 'fullNameError', false);
        }

        // Email
        if (!isValidEmail(emailInput.value)) {
            setFieldError(emailInput, 'emailError', true);
            isValid = false;
        } else {
            setFieldError(emailInput, 'emailError', false);
        }

        // Password Complexity
        const isPasswordStrong = evaluatePassword(passwordInput.value);
        if (!isPasswordStrong) {
            setFieldError(passwordInput, 'passwordError', true);
            isValid = false;
        } else {
            setFieldError(passwordInput, 'passwordError', false);
        }

        // Confirm Password Match
        if (!confirmPasswordInput.value || confirmPasswordInput.value !== passwordInput.value) {
            setFieldError(confirmPasswordInput, 'confirmPasswordError', true);
            isValid = false;
        } else {
            setFieldError(confirmPasswordInput, 'confirmPasswordError', false);
        }

        return isValid;
    };

    // ==========================================
    // 6. STEP 2 VALIDATION & PROFILE CONTROLS
    // ==========================================
    // Experience Slider Live Display
    if (expSlider && expValDisplay) {
        expSlider.addEventListener('input', () => {
            expValDisplay.textContent = expSlider.value;
        });
    }

    // Date of Birth & Dynamic Age Calculator
    if (dobInput && calculatedAgeInput) {
        // Set max date to today
        const today = new Date().toISOString().split('T')[0];
        dobInput.max = today;

        dobInput.addEventListener('change', () => {
            const dobVal = dobInput.value;
            if (!dobVal) {
                calculatedAgeInput.value = '';
                return;
            }
            const birthDate = new Date(dobVal);
            const now = new Date();
            let age = now.getFullYear() - birthDate.getFullYear();
            const monthDiff = now.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age >= 0) {
                calculatedAgeInput.value = `${age} years old`;
                if (age < 18) {
                    setFieldError(dobInput, 'dobError', true, 'You must be at least 18 years old to create an account.');
                } else {
                    setFieldError(dobInput, 'dobError', false);
                }
            } else {
                calculatedAgeInput.value = '';
                setFieldError(dobInput, 'dobError', true, 'Invalid birth date.');
            }
        });
    }

    // File Drag & Drop Handling
    if (fileDropzone && userFileInput) {
        ['dragenter', 'dragover'].forEach(eventName => {
            fileDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                fileDropzone.classList.add('drag-active');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            fileDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                fileDropzone.classList.remove('drag-active');
            });
        });

        fileDropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            if (dt && dt.files && dt.files.length > 0) {
                handleFileUpload(dt.files[0]);
            }
        });

        userFileInput.addEventListener('change', () => {
            if (userFileInput.files && userFileInput.files.length > 0) {
                handleFileUpload(userFileInput.files[0]);
            }
        });

        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                resetFileUpload();
            });
        }
    }

    const handleFileUpload = (file) => {
        // Check size (5MB max)
        const maxBytes = 5 * 1024 * 1024;
        if (file.size > maxBytes) {
            alert('File exceeds maximum size limit of 5 MB.');
            return;
        }

        uploadedFile = file;
        previewFileName.textContent = file.name;
        previewFileSize.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

        // Check if image for preview
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewThumb.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        } else {
            previewThumb.innerHTML = '📄';
        }

        dropzoneEmpty.classList.add('hidden');
        dropzonePreview.classList.remove('hidden');
    };

    const resetFileUpload = () => {
        uploadedFile = null;
        userFileInput.value = '';
        dropzoneEmpty.classList.remove('hidden');
        dropzonePreview.classList.add('hidden');
        previewThumb.innerHTML = '';
    };

    const validateStep2 = () => {
        let isValid = true;

        // Phone validation (digits only, 7 to 15 digits)
        const phoneVal = phoneInput.value.replace(/[\s\-\(\)]/g, '');
        if (!phoneVal || !/^\d{7,15}$/.test(phoneVal)) {
            setFieldError(phoneInput, 'phoneError', true);
            isValid = false;
        } else {
            setFieldError(phoneInput, 'phoneError', false);
        }

        // Date of birth
        if (!dobInput.value) {
            setFieldError(dobInput, 'dobError', true, 'Please provide your date of birth.');
            isValid = false;
        } else {
            const birthDate = new Date(dobInput.value);
            const now = new Date();
            let age = now.getFullYear() - birthDate.getFullYear();
            const monthDiff = now.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                setFieldError(dobInput, 'dobError', true, 'You must be at least 18 years old.');
                isValid = false;
            } else {
                setFieldError(dobInput, 'dobError', false);
            }
        }

        // Gender selection
        const selectedGender = document.querySelector('input[name="gender"]:checked');
        const genderGroup = document.querySelector('.pill-radio-group');
        const genderErrorEl = document.getElementById('genderError');
        if (!selectedGender) {
            if (genderErrorEl) genderErrorEl.style.display = 'block';
            isValid = false;
        } else {
            if (genderErrorEl) genderErrorEl.style.display = 'none';
        }

        // Primary Role
        if (!primaryRoleSelect.value) {
            setFieldError(primaryRoleSelect, 'roleError', true);
            isValid = false;
        } else {
            setFieldError(primaryRoleSelect, 'roleError', false);
        }

        return isValid;
    };

    // ==========================================
    // 7. STEP 3 VALIDATION, OTP & SUMMARY
    // ==========================================
    // OTP Input Controls with auto-tabbing and paste
    otpInputs.forEach((input, idx) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            e.target.value = val;

            if (val && idx < otpInputs.length - 1) {
                otpInputs[idx + 1].focus();
            }

            // Clear error once typing
            const otpError = document.getElementById('otpError');
            if (otpError) otpError.style.display = 'none';
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && idx > 0) {
                otpInputs[idx - 1].focus();
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
            const digits = pasteData.replace(/[^0-9]/g, '').slice(0, 4).split('');
            digits.forEach((digit, i) => {
                if (otpInputs[i]) {
                    otpInputs[i].value = digit;
                }
            });
            if (digits.length > 0) {
                const nextFocus = Math.min(digits.length, otpInputs.length - 1);
                otpInputs[nextFocus].focus();
            }
        });
    });

    // Refresh OTP Generator
    const generateNewOtp = () => {
        const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
        expectedOtp = randomCode;
        if (demoOtpCodeDisplay) demoOtpCodeDisplay.textContent = randomCode;
        otpInputs.forEach(input => (input.value = ''));
        if (otpInputs[0]) otpInputs[0].focus();
    };

    if (resendOtpBtn) {
        resendOtpBtn.addEventListener('click', generateNewOtp);
    }

    const updateSummaryCard = () => {
        if (summaryName) summaryName.textContent = fullNameInput.value.trim() || '—';
        if (summaryEmail) summaryEmail.textContent = emailInput.value.trim() || '—';
        if (otpTargetEmail) otpTargetEmail.textContent = emailInput.value.trim() || 'your email';

        const code = countryCodeSelect ? countryCodeSelect.value : '+91';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        if (summaryPhone) summaryPhone.textContent = phone ? `${code} ${phone}` : '—';

        if (summaryDomain && primaryRoleSelect) {
            const selectedText = primaryRoleSelect.options[primaryRoleSelect.selectedIndex]?.text;
            summaryDomain.textContent = selectedText && primaryRoleSelect.value ? selectedText : '—';
        }
    };

    const validateStep3 = () => {
        let isValid = true;

        // Check OTP digits
        const enteredOtp = otpInputs.map(input => input.value).join('');
        const otpError = document.getElementById('otpError');
        if (enteredOtp !== expectedOtp) {
            if (otpError) otpError.style.display = 'block';
            isValid = false;
        } else {
            if (otpError) otpError.style.display = 'none';
        }

        // Terms consent
        const termsError = document.getElementById('termsError');
        if (!termsConsent.checked) {
            if (termsError) termsError.style.display = 'block';
            isValid = false;
        } else {
            if (termsError) termsError.style.display = 'none';
        }

        return isValid;
    };

    // ==========================================
    // 8. BUTTON EVENTS & SUBMISSION
    // ==========================================
    nextBtn.addEventListener('click', () => {
        if (currentStep === 1) {
            if (!validateStep1()) return;
            currentStep = 2;
            updateWizardUI();
        } else if (currentStep === 2) {
            if (!validateStep2()) return;
            currentStep = 3;
            updateWizardUI();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateWizardUI();
        }
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate final step
        if (!validateStep3()) return;

        // Populate Success Modal Data
        if (registeredUserEmail) registeredUserEmail.textContent = emailInput.value.trim();
        if (registeredUserName) registeredUserName.textContent = fullNameInput.value.trim();
        if (registeredUserRole && primaryRoleSelect) {
            registeredUserRole.textContent = primaryRoleSelect.options[primaryRoleSelect.selectedIndex].text;
        }

        // Render Confetti Particles
        createConfetti();

        // Show Modal
        if (successModal) {
            successModal.classList.remove('hidden');
        }
    });

    // Confetti Generator
    const createConfetti = () => {
        if (!confettiContainer) return;
        confettiContainer.innerHTML = '';
        const colors = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

        for (let i = 0; i < 40; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = `${Math.random() * 1.5}s`;
            piece.style.animationDuration = `${2 + Math.random() * 2}s`;
            confettiContainer.appendChild(piece);
        }
    };

    // Modal Continue Action
    if (modalContinueBtn) {
        modalContinueBtn.addEventListener('click', () => {
            if (successModal) successModal.classList.add('hidden');
            // Reset to beginning
            form.reset();
            currentStep = 1;
            resetFileUpload();
            evaluatePassword('');
            updateWizardUI();
        });
    }

    // Initialize UI
    updateWizardUI();
    evaluatePassword('');
});
