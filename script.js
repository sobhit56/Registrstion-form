document.addEventListener('DOMContentLoaded', function() {
    // ===== DOM Elements =====
    const form = document.getElementById('registrationForm');
    const resetBtn = document.getElementById('resetBtn');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.getElementById('strengthText');
    const aboutTextarea = document.getElementById('about');
    const charCount = document.getElementById('charCount');
    const experienceRange = document.getElementById('experience');
    const experienceValue = document.getElementById('experienceValue');
    const fileInput = document.getElementById('resume');
    const fileName = document.querySelector('.file-name');
    const fileLabel = document.querySelector('.file-label');
    const countrySelect = document.getElementById('country');

    // ===== PASSWORD STRENGTH CHECKER =====
    passwordInput.addEventListener('input', checkPasswordStrength);
    
    function checkPasswordStrength() {
        const password = passwordInput.value;
        let strength = 0;
        let color = '#f72585';
        let text = 'Weak';
        
        // Check password criteria
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        
        // Update strength indicator
        strengthBar.style.width = strength + '%';
        
        // Update color and text based on strength
        if (strength >= 75) {
            color = '#4cc9f0';
            text = 'Strong';
        } else if (strength >= 50) {
            color = '#f8961e';
            text = 'Medium';
        } else if (strength >= 25) {
            color = '#f72585';
            text = 'Weak';
        } else {
            color = '#495057';
            text = 'None';
        }
        
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
        
        clearError('password');
    }

    // ===== CHARACTER COUNTER =====
    aboutTextarea.addEventListener('input', updateCharCount);
    
    function updateCharCount() {
        const length = aboutTextarea.value.length;
        charCount.textContent = length;
        
        // Limit to 500 characters
        if (length > 500) {
            aboutTextarea.value = aboutTextarea.value.substring(0, 500);
            charCount.textContent = 500;
        }
        
        charCount.style.color = length > 450 ? '#f72585' : '#6c757d';
        clearError('about');
    }

    // ===== EXPERIENCE RANGE VALUE DISPLAY =====
    experienceRange.addEventListener('input', updateExperienceValue);
    
    function updateExperienceValue() {
        experienceValue.textContent = experienceRange.value;
    }

    // ===== FILE UPLOAD WITH DRAG & DROP =====
    fileInput.addEventListener('change', updateFileName);
    
    // Drag & drop functionality
    fileLabel.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });

    fileLabel.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
    });

    fileLabel.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            updateFileName();
        }
    });
    
    function updateFileName() {
        const file = fileInput.files[0];
        if (file) {
            fileName.textContent = file.name;
            fileName.style.color = '#4cc9f0';
            
            // Validate file
            if (validateFile()) {
                clearError('resume');
            }
        } else {
            fileName.textContent = 'No file chosen';
            fileName.style.color = '#6c757d';
        }
    }
    
    function validateFile() {
        const file = fileInput.files[0];
        
        if (!file) {
            return true; // File is optional
        }
        
        // File size validation (2MB)
        if (file.size > 2 * 1024 * 1024) {
            showError('resume', 'File size must be less than 2MB');
            return false;
        }
        
        // File type validation
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExt)) {
            showError('resume', 'Only PDF, DOC, and DOCX files are allowed');
            return false;
        }
        
        return true;
    }

    // ===== FORM PROGRESS CALCULATOR =====
    const formInputs = form.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('input', calculateProgress);
        input.addEventListener('change', calculateProgress);
    });
    
    function calculateProgress() {
        let filled = 0;
        let total = 0;
        
        formInputs.forEach(input => {
            // Skip buttons
            if (input.type === 'button' || input.type === 'submit' || input.type === 'reset') return;
            
            total++;
            
            if (input.type === 'radio' || input.type === 'checkbox') {
                // Handle radio/checkbox groups
                const name = input.name;
                const group = form.querySelectorAll(`[name="${name}"]`);
                let groupFilled = false;
                
                group.forEach(item => {
                    if (item.checked) groupFilled = true;
                });
                
                if (groupFilled) filled++;
            } else if (input.type === 'file') {
                // Handle file input
                if (input.files && input.files.length > 0) filled++;
            } else if (input.value.trim() !== '') {
                // Handle other inputs
                filled++;
            }
        });
        
        const percentage = Math.round((filled / total) * 100);
        progressBar.style.width = percentage + '%';
        progressText.textContent = percentage + '%';
        
        // Update progress bar color based on percentage
        if (percentage >= 75) {
            progressBar.style.background = 'linear-gradient(90deg, #4361ee, #4cc9f0)';
        } else if (percentage >= 50) {
            progressBar.style.background = 'linear-gradient(90deg, #4361ee, #f8961e)';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, #4361ee, #f72585)';
        }
    }

    // ===== ERROR HANDLING FUNCTIONS =====
    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (!element) return false;
        
        const formGroup = element.closest('.form-group');
        
        if (!formGroup.querySelector('.error-message')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            formGroup.appendChild(errorDiv);
        } else {
            formGroup.querySelector('.error-message').textContent = message;
        }
        
        formGroup.classList.add('error');
        element.classList.add('error');
        
        return false;
    }

    function clearError(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return true;
        
        const formGroup = element.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error');
            element.classList.remove('error');
            
            const errorMessage = formGroup.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
        
        return true;
    }

    // ===== REAL-TIME VALIDATION =====
    countrySelect.addEventListener('change', function() {
        if (this.value === '') {
            showError('country', 'Please select a country');
        } else {
            clearError('country');
        }
    });

    // Email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            showError('email', 'Please enter a valid email address');
        } else {
            clearError('email');
        }
    });

    // Age validation
    const ageInput = document.getElementById('age');
    ageInput.addEventListener('input', function() {
        const age = parseInt(this.value);
        if (age < 18 || age > 60) {
            showError('age', 'Age must be between 18 and 60');
        } else {
            clearError('age');
        }
    });

    // ===== FORM VALIDATION =====
    function validateForm(data) {
        const errors = [];
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        // Validate age
        if (data.age < 18 || data.age > 60) {
            errors.push('Age must be between 18 and 60');
        }
        
        // Validate password strength
        if (data.password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        
        // Validate skills selection
        if (data.skills.length === 0) {
            errors.push('Please select at least one skill');
        }
        
        // Validate country
        if (!data.country) {
            errors.push('Please select a country');
        }
        
        // Validate terms agreement
        if (!data.terms) {
            errors.push('You must agree to the terms and conditions');
        }
        
        return errors;
    }

    // ===== FORM SUBMISSION =====
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear all previous errors
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(el => {
            el.remove();
        });
        
        // Validate required fields
        let isValid = true;
        
        // Country validation
        if (countrySelect.value === '') {
            showError('country', 'Please select a country');
            isValid = false;
        }
        
        // File validation
        if (!validateFile()) {
            isValid = false;
        }
        
        // If validation fails, scroll to first error
        if (!isValid) {
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Collect form data
        const formData = {
            fullname: document.getElementById('fullname').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: passwordInput.value,
            age: parseInt(document.getElementById('age').value),
            dob: document.getElementById('dob').value,
            gender: getSelectedRadioValue('gender'),
            skills: getSelectedCheckboxValues('skills'),
            experience: parseInt(experienceRange.value),
            country: countrySelect.value,
            about: aboutTextarea.value.trim(),
            resume: fileInput.files[0] ? fileInput.files[0].name : null,
            terms: document.getElementById('terms').checked
        };
        
        // Validate form data
        const errors = validateForm(formData);
        
        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n' + errors.join('\n'));
            return;
        }
        
        // Log form data to console (for demo)
        console.log('📝 Form Data Submitted:', formData);
        
        // Show success modal
        successModal.style.display = 'flex';
        
        // In a real application, you would send data to a server here
        // Example: fetch('/api/register', { method: 'POST', body: JSON.stringify(formData) })
        
        // Reset form after 3 seconds
        setTimeout(() => {
            form.reset();
            resetFormUI();
            successModal.style.display = 'none';
            calculateProgress(); // Reset progress
        }, 3000);
    });

    // ===== RESET BUTTON =====
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all form data?')) {
            form.reset();
            resetFormUI();
            calculateProgress(); // Reset progress
        }
    });
    
    function resetFormUI() {
        strengthBar.style.width = '0%';
        strengthText.textContent = 'None';
        strengthText.style.color = '#495057';
        charCount.textContent = '0';
        charCount.style.color = '#6c757d';
        experienceValue.textContent = '5';
        fileName.textContent = 'No file chosen';
        fileName.style.color = '#6c757d';
        
        // Clear all errors
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(el => {
            el.remove();
        });
    }

    // ===== MODAL CONTROLS =====
    closeModal.addEventListener('click', function() {
        successModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });

    // ===== HELPER FUNCTIONS =====
    function getSelectedRadioValue(name) {
        const selected = form.querySelector(`[name="${name}"]:checked`);
        return selected ? selected.value : null;
    }
    
    function getSelectedCheckboxValues(name) {
        const checkboxes = form.querySelectorAll(`[name="${name}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value);
    }

    // ===== INITIALIZE =====
    // Set date restrictions for date of birth
    const dobInput = document.getElementById('dob');
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 60);
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 18);
    
    dobInput.min = minDate.toISOString().split('T')[0];
    dobInput.max = maxDate.toISOString().split('T')[0];
    
    // Trigger initial calculations
    updateCharCount();
    updateExperienceValue();
    calculateProgress();
    
    // Age input restrictions
    ageInput.addEventListener('input', function() {
        if (this.value < 18) this.value = 18;
        if (this.value > 60) this.value = 60;
    });
});