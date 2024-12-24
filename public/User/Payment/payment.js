new Vue({
    el: '#app',
    data: {
        address: '',
        user: window.user,
        cartItems: window.cartItems,
        estimatedDeliveryDate: '',
        subtotal: 0.00,
        total: 5.00,
    },
    delimiters: ['[[', ']]'],
    methods: {
        updateTotal() {
            const shippingFee = parseFloat(document.getElementById('shippingFee').innerText);
            this.total = this.subtotal + shippingFee;
        },
        async fecthAddress(){
            const response = await axios.get(`/payment/api/get-address?userid=${this.user.userid}`); // Get data from the server
            this.address = response.data.address;

            console.log(this.address);
        },
        calculateEstimatedDeliveryDate() {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 10); // Add 10 days to the current date
            this.estimatedDeliveryDate = currentDate.toDateString(); // Format the date as a string
        },
        calculateSubtotal() {
            this.subtotal = this.cartItems.reduce((sum, item) => sum + (item.currentprice * item.quantity), 0);
        },
        placeOrder(){
            try {
                const orderData = {
                    user: this.user,
                    cartItems: this.cartItems,
                    address: this.address,
                    total: this.total,
                    estimatedDeliveryDate: this.estimatedDeliveryDate,
                    paymentMethod: document.getElementById('paymentMethod').value
                };

                axios.post('/payment/api/place-order', orderData)
                .then(response => {
                    alert('Order placed successfully!');
                    // Redirect or perform other actions after successful order placement
                })
                .catch(error => {
                    alert('Error placing order. Please try again.');
                });                
                

                window.location.href = '/'; // Redirect to the home page
            } catch (error) {
                console.error('Error placing order:', error);
                alert('Error placing order. Please try again.');
            }
        },
        validateInformation(){
            if (this.user.username === 'null') {
                alert('Please update username in your account.');
                return;
            }
            if (this.user.phone === 'null') {
                alert('Please update phone in your account.');
                return;
            }
            if (this.address === '') {
                alert('Please update address in your account.');
                return;
            }

            this.placeOrder
        }
    },
    mounted() {
        this.fecthAddress();
        this.calculateEstimatedDeliveryDate();
        this.calculateSubtotal();
        this.updateTotal();
    }
});