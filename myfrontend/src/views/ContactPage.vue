<template>
    <div>
        <!-- section 1 -->
        <section id="contact">
            <div class="contact">
                <p style="font-size: 40px;font-weight: bold;">ช่องทางการติดต่อ</p>
                <table>
                        <tr >
                            <td><img :src="images[5] ? imagePath(images[5].path) : ''" width="50" style="margin-bottom:20px; margin-right:20px"/></td>
                            <td>0912345678</td>
                        </tr>
                        <tr>
                            <td><img :src="images[4] ? imagePath(images[4].path) : ''" width="50" style="margin-bottom:20px; margin-right:20px"/></td>
                            <td>hogwash@gmail.com</td>
                        </tr>
                        <tr>
                            <td><img :src="images[3] ? imagePath(images[3].path) : ''" width="50" style="margin-bottom:20px; margin-right:20px"/></td>
                            <td>@HogWashLaundry</td>
                        </tr>
                </table>
            </div>
            <div class="mailbox">
            <!-- <div class="mailbox" v-show="mailSent == false"> -->
                <p style="font-size: 25px;">หรือติดต่อเราผ่าน <b>กล่องข้อความ</b> ทันทีได้ที่นี่</p>
                <form class="mailbox-form" action="/contact/" enctype="multipart/form-data" method="POST">
                    <div class="col-md-6">
                        <label style="font-size: 18px;">หัวข้อเรื่อง</label>
                        <input type="text" class="form-control" placeholder="" id="comment_title" v-model="feedbackTitle" maxlength="30">
                    </div><br>
                        <label style="font-size: 18px;">รายละเอียด</label>
                        <textarea type="text" class="form-control" style='height:100px;resize: none;' placeholder="" id="comment_detail" v-model="feedbackDes"></textarea>
                        <!-- <div class="card card_login" v-show="show_signIn"> -->
                        <button type="button" :class=" ['btn sendMail', mailSent ? 'disabled' : ' '] " 
                        @click="mailSent = !mailSent, addFeedback()" v-show="mailSent == false" on>
                        ส่งข้อความ</button>
                        <button type="button" class="btn sendMail disabled" v-show="mailSent" style="width:180px" on>✓ ส่งข้อความแล้ว</button>
                </form>
            </div>
            <div class="mailbox" v-show="mailSent">
                 <!-- <p style="font-size: 23px;">✓ ส่งข้อความแล้ว</p> -->
            </div>
        </section>
    </div>
</template>
  
<script>
import "../assets/css/contact.css";
import axios from '@/plugins/axios'
export default {
    name: 'HomePage',
    props: {news: Array} ["user"],
    data() {
        return {
            mailSent: false,
            images: [],
            feedbackTitle: "",
            feedbackDes: ""
        }
    },
    mounted() {
        this.getContact();
    },
    methods: {
        getContact() {
            axios
                .get("/contact")
                .then((response) => {
                    this.images = response.data.images;
                    // console.log(this.images)
                })
                .catch((err) => {
                    console.log(err);
                });
            
        },
        imagePath(file_path) {
            if (file_path) {
                // console.log(file_path)
                return "http://localhost:3000/" + file_path;
            }
        },
        addFeedback() {
            let data = {
                feedbackTitle: this.feedbackTitle,
                feedbackDes: this.feedbackDes,
            }
            axios
                .post(`/contact`, data)
                .then(() => {
                    alert("Feedback send Successfully");
                    location.reload();
                })
                .catch((error) => {
                    console.log(error.response.data.message);
                });
            },
    }
}
</script>