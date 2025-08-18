// Payment Gateway JavaScript
class PaymentGateway {
    constructor() {
        this.form = document.getElementById('paymentForm');
        this.amountInput = document.getElementById('amount');
        this.cardNumberInput = document.getElementById('cardNumber');
        this.expiryDateInput = document.getElementById('expiryDate');
        this.cvvInput = document.getElementById('cvv');
        this.submitBtn = document.getElementById('submitBtn');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateOrderSummary();
    }

    setupEventListeners() {
        // Amount input listener
        this.amountInput.addEventListener('input', () => {
            this.updateOrderSummary();
        });

        // Card number formatting and validation
        this.cardNumberInput.addEventListener('input', (e) => {
            this.formatCardNumber(e);
            this.detectCardType(e.target.value);
        });

        // Expiry date formatting
        this.expiryDateInput.addEventListener('input', (e) => {
            this.formatExpiryDate(e);
        });

        // CVV validation
        this.cvvInput.addEventListener('input', (e) => {
            this.formatCVV(e);
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        this.form.querySelectorAll('input').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        
        if (formattedValue.length > 19) {
            formattedValue = formattedValue.substr(0, 19);
        }
        
        e.target.value = formattedValue;
    }

    detectCardType(cardNumber) {
        const cardType = document.getElementById('cardType');
        const cleanNumber = cardNumber.replace(/\s/g, '');
        
        let type = '';
        let icon = '';
        
        if (/^4/.test(cleanNumber)) {
            type = 'visa';
            icon = '<i class="fab fa-cc-visa text-2xl text-blue-600"></i>';
        } else if (/^5[1-5]/.test(cleanNumber)) {
            type = 'mastercard';
            icon = '<i class="fab fa-cc-mastercard text-2xl text-red-500"></i>';
        } else if (/^3[47]/.test(cleanNumber)) {
            type = 'amex';
            icon = '<i class="fab fa-cc-amex text-2xl text-blue-500"></i>';
        } else if (/^6/.test(cleanNumber)) {
            type = 'discover';
            icon = '<i class="fab fa-cc-discover text-2xl text-orange-500"></i>';
        }
        
        cardType.innerHTML = icon;
    }

    formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        e.target.value = value;
    }

    formatCVV(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.id) {
            case 'amount':
                isValid = value && parseFloat(value) > 0;
                errorMessage = 'Please enter a valid amount';
                break;
            case 'cardNumber':
                const cleanCardNumber = value.replace(/\s/g, '');
                isValid = this.validateCardNumber(cleanCardNumber);
                errorMessage = 'Please enter a valid card number';
                break;
            case 'expiryDate':
                isValid = this.validateExpiryDate(value);
                errorMessage = 'Please enter a valid expiry date';
                break;
            case 'cvv':
                isValid = /^\d{3,4}$/.test(value);
                errorMessage = 'Please enter a valid CVV';
                break;
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'phone':
                isValid = /^[\+]?[0-9\s\-\(\)]{10,}$/.test(value);
                errorMessage = 'Please enter a valid phone number';
                break;
            case 'pincode':
                isValid = /^\d{6}$/.test(value);
                errorMessage = 'Please enter a valid PIN code';
                break;
            default:
                isValid = value.length > 0;
                errorMessage = 'This field is required';
        }

        this.updateFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    validateCardNumber(cardNumber) {
        // Luhn algorithm
        let sum = 0;
        let shouldDouble = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));
            
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        return (sum % 10) === 0 && cardNumber.length >= 13;
    }

    validateExpiryDate(expiry) {
        if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
        
        const [month, year] = expiry.split('/').map(num => parseInt(num));
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        if (month < 1 || month > 12) return false;
        if (year < currentYear || (year === currentYear && month < currentMonth)) return false;
        
        return true;
    }

    updateFieldValidation(field, isValid, errorMessage) {
        field.classList.remove('border-red-500', 'border-green-500');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid && field.value.trim()) {
            field.classList.add('border-red-500');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-red-500 text-xs mt-1';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        } else if (isValid && field.value.trim()) {
            field.classList.add('border-green-500');
        }
    }

    updateOrderSummary() {
        const amount = parseFloat(this.amountInput.value) || 0;
        const processingFee = amount * 0.029; // 2.9% processing fee
        const tax = (amount + processingFee) * 0.18; // 18% GST
        const total = amount + processingFee + tax;

        document.getElementById('subtotal').textContent = `₹${amount.toFixed(2)}`;
        document.getElementById('processingFee').textContent = `₹${processingFee.toFixed(2)}`;
        document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
    }

    async handleSubmit() {
        // Validate all fields
        const fields = this.form.querySelectorAll('input[required]');
        let isFormValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showToast('error', 'Validation Error', 'Please fix the errors in the form');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Collect form data
            const formData = {
                amount: parseFloat(this.amountInput.value),
                cardNumber: this.cardNumberInput.value.replace(/\s/g, ''),
                expiryDate: this.expiryDateInput.value,
                cvv: this.cvvInput.value,
                cardholderName: document.getElementById('cardholderName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                pincode: document.getElementById('pincode').value,
                timestamp: new Date().toISOString(),
                processingFee: (parseFloat(this.amountInput.value) * 0.029).toFixed(2),
                tax: ((parseFloat(this.amountInput.value) + parseFloat(this.amountInput.value) * 0.029) * 0.18).toFixed(2),
                total: (parseFloat(this.amountInput.value) + parseFloat(this.amountInput.value) * 0.029 + (parseFloat(this.amountInput.value) + parseFloat(this.amountInput.value) * 0.029) * 0.18).toFixed(2)
            };

            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Submit to server using window.form
            if (typeof window.form !== 'undefined') {
                await window.form.submit(formData);
            }

            this.showToast('success', 'Payment Successful!', `Payment of ₹${formData.total} has been processed successfully.`);
            
            // Reset form after successful payment
            setTimeout(() => {
                this.form.reset();
                this.updateOrderSummary();
            }, 3000);

        } catch (error) {
            console.error('Payment error:', error);
            this.showToast('error', 'Payment Failed', 'An error occurred while processing your payment. Please try again.');
        } finally {
            this.setLoadingState(false);
        }
    }

    setLoadingState(loading) {
        const submitText = document.getElementById('submitText');
        const loadingText = document.getElementById('loadingText');
        
        if (loading) {
            submitText.classList.add('hidden');
            loadingText.classList.remove('hidden');
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            submitText.classList.remove('hidden');
            loadingText.classList.add('hidden');
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }

    showToast(type, title, message) {
        const toast = document.getElementById('toast');
        const toastIcon = document.getElementById('toastIcon');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');

        // Set icon based on type
        let iconHTML = '';
        let bgColor = '';
        
        switch (type) {
            case 'success':
                iconHTML = '<i class="fas fa-check-circle text-green-500 text-xl"></i>';
                bgColor = 'bg-green-50 border-green-200';
                break;
            case 'error':
                iconHTML = '<i class="fas fa-exclamation-circle text-red-500 text-xl"></i>';
                bgColor = 'bg-red-50 border-red-200';
                break;
            case 'warning':
                iconHTML = '<i class="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>';
                bgColor = 'bg-yellow-50 border-yellow-200';
                break;
            default:
                iconHTML = '<i class="fas fa-info-circle text-blue-500 text-xl"></i>';
                bgColor = 'bg-blue-50 border-blue-200';
        }

        toastIcon.innerHTML = iconHTML;
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        
        // Add background color
        toast.firstElementChild.className = toast.firstElementChild.className.replace(/bg-\w+-\d+\s+border-\w+-\d+/, bgColor);

        // Show toast
        toast.classList.remove('translate-x-full');
        toast.classList.add('translate-x-0');

        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideToast();
        }, 5000);
    }

    hideToast() {
        const toast = document.getElementById('toast');
        toast.classList.remove('translate-x-0');
        toast.classList.add('translate-x-full');
    }
}

// Global function for hiding toast
function hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('translate-x-0');
    toast.classList.add('translate-x-full');
}

// Initialize payment gateway when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PaymentGateway();
});

// Add some demo functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add demo amount button
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        // Add quick amount buttons
        const amountContainer = amountInput.parentNode.parentNode;
        const quickAmounts = document.createElement('div');
        quickAmounts.className = 'flex gap-2 mt-2';
        quickAmounts.innerHTML = `
            <button type="button" class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" onclick="setAmount(100)">₹100</button>
            <button type="button" class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" onclick="setAmount(500)">₹500</button>
            <button type="button" class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" onclick="setAmount(1000)">₹1000</button>
            <button type="button" class="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors" onclick="setAmount(5000)">₹5000</button>
        `;
        amountContainer.appendChild(quickAmounts);
    }
});

function setAmount(amount) {
    document.getElementById('amount').value = amount;
    document.getElementById('amount').dispatchEvent(new Event('input'));
}

// Demo card numbers for testing
function fillDemoCard() {
    document.getElementById('cardNumber').value = '4111 1111 1111 1111';
    document.getElementById('expiryDate').value = '12/25';
    document.getElementById('cvv').value = '123';
    document.getElementById('cardholderName').value = 'John Doe';
    
    // Trigger events for validation
    document.getElementById('cardNumber').dispatchEvent(new Event('input'));
    document.getElementById('expiryDate').dispatchEvent(new Event('input'));
}