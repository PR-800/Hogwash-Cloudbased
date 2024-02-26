// var login = new Vue({
//     el: '#login',
//     data: {
//         show_signIn: true,
//         user_email: '',
//         user_password: '',
//         new_email: '',
//         new_password1: '',
//         new_password2: '',
//         users: [],
//         online: false,
//         user_online: '',
//     },
//     created() {
//         if (localStorage.getItem("usersData") != null) {
//             this.users = JSON.parse(localStorage.getItem("usersData"));  
//         }
//     },
//     methods: {
//         addUser() {
//             if (this.new_email == '' || this.new_password1 == '' || this.new_password2 == '') {
//                 alert('Please complete the form below')
//             }
//             else if (this.new_password1 != this.new_password2) {
//                 alert('Incorrect password confirmation')
//             }
//             else if (this.users.filter((data) => { return data.user_email == this.new_email }).length > 0) {
//                 alert('This email is already in use')
//             }
//             else if (this.new_email.includes('@') && this.new_email.includes('.')) {
//                 this.users.push({
//                     user_email: this.new_email,
//                     user_password: this.new_password1,
//                     // user_fname: '',
//                     // user_lname: ''
//                 })
//                 alert('Sign up successfully')
//                 const myJSON = JSON.stringify(this.users);
//                 localStorage.setItem("usersData", myJSON);
//                 location.reload();
//             }
//         },
//         checkUser() {
//             let check = this.users.filter((data) => {
//                 return (data.user_email == this.user_email && data.user_password == this.user_password)
//             })
//             if(check.length > 0) {
//                 if (check[0].user_email == this.user_email && check[0].user_password == this.user_password) {
//                     alert('Sign in sucessfully')
//                     this.online = true
//                     this.online_user = this.user_email
//                     localStorage.setItem("online_status", JSON.stringify(this.online));
//                     localStorage.setItem("online_user", JSON.stringify(this.online_user));
//                     window.location.href = "/";
//                 }
//                 else {
//                     alert('Incorrect email or password')
//                 }
//             }
//             else {
//                 alert('Incorrect email or password')
//             }
//         },
//     }
// })