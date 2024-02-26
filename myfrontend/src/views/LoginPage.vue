<template>
    <div class="loginPage">
        <a class="backButton" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="bi bi-arrow-bar-left"
                viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                    d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5ZM10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5Z" />
            </svg>
        </a>

        <div class="loginCard" v-show="show_login">
            <!-- LOG In -->
            <div class="row">
            <div class="column card" style="background-color:#CAEAF1;" >
                <div class="card-body">
                        <h5 class="card-title title_login mx-3">ลงชื่อเข้าใช้</h5>
                        <div class="card-text">
                        <!-- <form action="/" enctype="multipart/form-data" method="GET"> -->
                            <div class="form-group mx-3 py-4">
                                <input v-model="loginEmail" class="form-control" type="email" style="" placeholder="อีเมล" />
                            </div>
                            <div class="form-group mx-3 py-4">
                                <input v-model="loginPassword" class="form-control" type="password" placeholder="รหัสผ่าน" />
                            </div>
                            <button class="btn userButton py-2 mb-3" type="submit" style="background-color:#59A8B9;color:white;"
                                @click="submit()">
                                เข้าสู่ระบบ
                            </button>
                        <!-- </form> -->
                        </div>
                        <br><small class="text-muted py-4">ยังไม่มีบัญชีผู้ใช้ ?
                            <a @click="show_login = !show_login, show_signup == !show_signup" style="color:#59A8B9; cursor: pointer;">สมัครเลย</a>
                        </small>
                    </div>
                </div>
                <div class="column card loginCard" style="background-color:#CAEAF1;">
                    <div class="card-body"  style="border-radius: 30px;">
                        <img style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);"
                            :src="require('../assets/img/logo.png')">
                    </div>
                </div>
            </div>    
        </div>


        <div class="loginCard" v-show="show_login == false">
            <!-- SIGN up -->
            <div class="row">
            <div class="column card" style="background-color:#CAEAF1;" >
                <div class="card-body">
                    <img style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);"
                            :src="require('../assets/img/logo.png')">
                </div>
            </div>
            <div class="column card loginCard" style="background-color:#CAEAF1;">
                    <div class="card-body">
                        <h5 class="card-title title_login mx-3">สมัครสมาชิก</h5>
                        <a class="card-text">
                                <div class="form-group mx-3 py-3">
                                <input
                                    v-model="$v.signUpEmail.$model"
                                    :class="{ 'is-danger': $v.signUpEmail.$error }"
                                    class="form-control no-outline"
                                    type="text"
                                    placeholder="อีเมล"
                                />
                                <template v-if="$v.signUpEmail.$error">
                                    <p class="help is-danger" v-if="!$v.signUpEmail.required">
                                    This field is required
                                    </p>
                                    <p class="help is-danger" v-if="!$v.signUpEmail.email">Invalid Email</p>
                                </template>
                                </div>
                                <div class="form-group mx-3 py-3">
                                    <input
                                        v-model="$v.signUpPassword.$model"
                                        :class="{ 'is-danger': $v.signUpPassword.$error }"
                                        class="form-control"
                                        type="password"
                                        placeholder="รหัสผ่าน"
                                    />
                                    <template v-if="$v.signUpPassword.$error">
                                        <p class="help is-danger">
                                            {{ !$v.signUpPassword.required ? 'This field is required.' : '' }}
                                            {{ !$v.signUpPassword.minLength ? 'Password must be at least 6 letters.' : '' }}
                                            {{ !$v.signUpPassword.complexPassword ? 'Password is too easy.' : '' }}
                                        </p>
                                    </template>
                                </div>
                                <div class="form-group mx-3 py-3">
                                    <input
                                        v-model="$v.confirm_password.$model"
                                        :class="{ 'is-danger': $v.confirm_password.$error }"
                                        class="form-control"
                                        type="password"
                                        placeholder="ยืนยันรหัสผ่าน"
                                    />
                                    <template v-if="$v.confirm_password.$error">
                                        <p class="help is-danger" v-if="!$v.confirm_password.sameAs">
                                        Password do not match
                                        </p>
                                    </template>
                                </div><br>
                                <button class="btn userButton py-2 mb-3" type="submit" style="background-color:#59A8B9;color:white;"
                                    @click="addUser()">
                                    สร้างบัญชีผู้ใช้
                                </button><br>
                            <!-- </form> -->
                        </a>
                        <small class="text-muted py-4">มีบัญชีผู้ใช้อยู่แล้ว ?
                            <a @click="show_login = !show_login"
                                style="color:#59A8B9; cursor: pointer;">เข้าสู่ระบบเลย</a>
                        </small>
                    </div>
                </div>

                
            </div>    
        </div>


    </div>
</template>

<script>
import axios from '@/plugins/axios'
import "../assets/css/login.css";

import { required, email, minLength, sameAs, } from 'vuelidate/lib/validators';

function complexPassword(value) {
    if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
        return false;
    }
    return true;
}
export default {
    // props: ['user'],
    data() {
        return {
            signUpEmail: "",
            signUpPassword: "",
            confirm_password: "",
            loginEmail: "",
            loginPassword: "",
            myStyle:{
                backgroundColor:"#16a085" 
            },
            show_login: true,
            show_signup: false,
        };
    },
    validations: {
        signUpEmail: {
            required: required,
            email: email,
        },
        signUpPassword: {
            required: required,
            minLength: minLength(6),
            complex: complexPassword,
        },
        confirm_password: {
            sameAs: sameAs("signUpPassword"),
        },
    },
    methods: {
        addUser() {

        // Validate all fields
        this.$v.$touch();

        // เช็คว่าในฟอร์มไม่มี error
        if (!this.$v.$invalid) {            
            let data = {
                signUpEmail: this.signUpEmail,
                signUpPassword: this.signUpPassword,
                confirm_password: this.confirm_password,
            };

            axios
            .post("/user/signup", data)
            .then(() => {
                alert("Sign up Successfully");
                location.reload();
            })
            .catch(error => {
                alert('This email is already used')
                console.log(error.response.data)
            })
        }
        else {
            console.log()
        }
        },
        submit () {
            const data = {
                loginEmail: this.loginEmail,
                loginPassword: this.loginPassword
            } 
            axios.post('/user/login/', data)
            .then((res) => {
                alert('Login Successfully')
                const token = res.data.token                                
                localStorage.setItem('token', token) // เอา token ที่ได้ไปใส่ใน local storage
                this.$emit('auth-change')
                this.$router.push({path: '/'}) // login สำเร็จ -> ไปหน้า index
            })
            .catch(error => {
                alert('Incorrect email or password')
                console.log(error.response.data)
            })
        }
    },
};
</script>
