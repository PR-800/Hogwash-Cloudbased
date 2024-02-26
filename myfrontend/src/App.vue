<template>
  <div id="app">
    <!-- nav bar -->
    <nav
      class="navbar fixed-top navbar-expand-lg navbar-light justify-content-between" style="background-color:#CAEAF1;font-size:20px;">
      <a class="navbar-brand mx-4" href="/">
        <img
          :src="require('./assets/img/logo.png')"
          width="80"
          height=""
          alt=""
        />
      </a>
      <a class="navbar-brand" href="/" style="padding-top:10px;color: #59a8b9">HogWash</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
      
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <!-- <router-link to="/" class="nav-link">  //router-link ไม่ได้ทำการ refresh หน้าจอ จึงทำให้บางที frontend โหลดไม่ทัน
            สถานะเครื่องซักผ้า
            </router-link> -->
            <a class="nav-link" href="../#home2">สถานะเครื่องซักผ้า</a>
          </li>
          <li class="nav-item" v-if="user">
            <router-link to="/contact" prefetch="false" class="nav-link">
              <a>ติดต่อเรา</a>
            </router-link>
          </li>
          <!-- <li class="nav-item">
            <a class="nav-link" v-b-modal="'checkQueue'">ตรวจสอบคิว</a>
          </li> -->

          <li class="nav-item" v-if="user && user.role == 'admin'">
            <router-link to="/feedback" class="nav-link">
              <a style="color:#59A8B9;">กล่องข้อความ</a>
            </router-link>
          </li>
          <li class="nav-item" v-if="user && user.role == 'admin'">
            <a class="nav-link" style="color:#59A8B9;" v-b-modal="'announcement'">เพิ่มประกาศ</a>
          </li>

          <b-modal id="announcement" class="text-center" centered hide-header-close title="แก้ไขประกาศ">
              <textarea class="form-control" type="text" style='height:100px;resize: none;' v-model="announce"></textarea>
              <template #modal-footer>
                <button v-b-modal.modal-close_visit class="btn announceOp m-1" style="background-color: #b3b3b3;" block @click="$bvModal.hide('announcement');">ยกเลิก</button>
                <button v-b-modal.modal-close_visit class="btn announceOp mr-4" style="background-color: #59a8b9;" @click="setAnnouncement()">ยืนยัน</button>
            </template>
          </b-modal>

          <!-- test modal ----------------------------------------------->
          <!-- <li class="nav-item">
            <a
              class="nav-link"
              v-b-modal="'gotQueue'"
            >
              <b class="text-info"> ( ทดสอบได้คิว ) </b></a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              v-b-modal="'checkQueue'"
            >
              <b class="text-danger"> ( กดคิวซ้ำ ) </b></a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              v-b-modal="'inQueue'"
            >
              <b class="text-danger"> ( inQueue ) </b></a
            >
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              v-b-modal="'completed'"
            >
              <b class="text-danger"> ( completed ) </b></a
            >
          </li> -->



        </ul>
      </div>

      <!-- to-login-page button -->
      <a  class="px-3 mx-3">
        <button 
          v-if="!user"
          class="btn my-2 my-sm-0"
          type="submit"
          style="
            background-color: #59a8b9;
            color: white;
            font-size: 20px;
            width: 120px;
          ">
          <router-link style="text-decoration: none; color: inherit;padding-right:0;" to="/user">
          เข้าสู่ระบบ
          </router-link>
        </button>
      </a>

      <!-- greeting button -->
      <b-dropdown  v-if="user" id="dropdown-right" size="lg" :text="'ยินดีต้อนรับ ' + user.email + ' ! '" variant="none"
      style="margin-right:20px;margin:15px;padding-right:0;" block menu-class="w-75" right
      >
        <b-dropdown-item v-b-modal="'changePassword'">
            <a style="font-size:18px;">แก้ไขรหัสผ่าน</a>
        </b-dropdown-item>
        <b-dropdown-item v-if="user && user.role == 'customer'">
          <router-link style="text-decoration: none; color: inherit;font-size:18px;" to="/history">
            ประวัติการใช้งาน
          </router-link>
        </b-dropdown-item>
        <b-dropdown-item v-if="user && user.role == 'admin'">
          <router-link style="text-decoration: none; color: inherit;font-size:18px;" to="/historylist">
            ประวัติการใช้งานทั้งหมด
          </router-link>
        </b-dropdown-item>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item @click="logOut()">
          <a style="font-size:18px">ออกจากระบบ</a>
        </b-dropdown-item>
      </b-dropdown>

        <!-- modal change password -->

        <b-modal id="changePassword" size='lg' centered hide-footer hide-header no-stacking>
          <template>
            <h1 class="modal-title my-4 w-100 text-center">
              แก้ไขรหัสผ่าน
            </h1>
              <form>
                <div class="row justify-content-center">
                  <div class="col-auto">
                    <table class="table no-border">
                      <tr style="border:none">
                        <td style="font-size:20px;font-weight: 300;text-align: right;border:none;">รหัสผ่านปัจจุบัน</td>
                        <td style="border:none;">
                          <input
                            v-model="currentPassword"
                            type="password"
                            class="form-control"
                            placeholder="รหัสผ่านปัจจุบัน"
                          />
                        </td>
                      </tr>
                      <tr style="border:none">
                        <td style="font-size:20px;font-weight: 300;text-align: right;border:none;">รหัสผ่านใหม่</td>
                        <td style="border:none;">
                          <input
                            v-model="newPassword"
                            type="password"
                            class="form-control"
                            placeholder="รหัสผ่านใหม่"
                          />
                        </td>
                      </tr>
                      <tr style="border:none">
                        <td style="font-size:20px;font-weight: 300;text-align: right;border:none;">ยืนยันรหัสผ่านใหม่</td>
                        <td style="border:none;">
                          <input
                            v-model="confirm_newPassword"
                            type="password"
                            class="form-control"
                            placeholder="ยืนยันรหัสผ่านใหม่"
                          />
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                <b-button
                  class="button-changePass btn py-2 mb-3"
                  type="submit"
                  style="background-color: #59a8b9; color: white"
                  @click="submitPassword()"
                >
                  บันทึก</b-button
                ><br />
              </form>
          </template>
        </b-modal>
    </nav>
    
    <!-- <header :class="{'headroom--unpinned': scrolled}"  v-on="handleScroll" class="headroom header">
      Header
    </header> -->

    <router-view :key="$route.fullPath" @auth-change="onAuthChange" :user="user"/>
  </div>
</template>

<script>
import axios from '@/plugins/axios'
// import "./assets/css/nav.css";

export default {
  data () {
    return {
      user: null,
      currentPassword: "",
      newPassword: "",
      confirm_newPassword: "",

      limitPosition: 500,
      scrolled: false,
      lastPosition: 0,

      announce: "",

      isFetch: false,
    }
  },
  mounted () {
    this.onAuthChange()
  },
  methods: {
    onAuthChange () {
      const token = localStorage.getItem('token')
      if (token) {
        this.getUser()
      }
    },
    getUser () {
      // const token = localStorage.getItem('token')
      // axios.get('http://localhost:3000/user/me', { headers: {Authorization: 'Bearer ' + token} }).then(res => {
      axios.get('/user/me').then(res => {
        this.user = res.data
      })
    },
    logOut() {
      localStorage.removeItem('token')
      axios.get('/').then(() => {})
      location.reload()
    },
    submitPassword() {
      const data = {
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
          confirm_newPassword: this.confirm_newPassword,
      } 
      axios
        .put("/user/" + this.user.id, data)
        .then((res) => {
          alert('Password updated');
          console.log(res)
        })
        .catch(error => {
          alert('Incorrect email or password')
          console.log(error.response.data)
        });
    },
    setAnnouncement() {
      console.log('setAnnouncement', this.announce)
      let data = {
          announce: this.announce,
      }
      axios
          .post(`/announcement`, data)
          .then(() => {
              alert("เพิ่มประกาศเรียบร้อยแล้ว");
              this.$bvModal.hide('modal-prevent-closing')
              location.reload();
          })
          .catch((error) => {
              console.log(error.response.data.message);
          });
    },
    navigateToHome2() {
      const element = document.getElementById('home2');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
  }
}
</script>

<style scoped>
.modal-header {
    justify-content: center;
}
.modal-body {
    margin: 10px;
    margin-top: 0;
}
.announceOp {
  border:none;
  color:white;
}
</style>
