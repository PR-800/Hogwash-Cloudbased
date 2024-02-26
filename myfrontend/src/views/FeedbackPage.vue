<template>
    <div class="feedback-border" v-if="user && user.role == 'admin'">
        <p style="font-size: 40px;font-weight: bold;">กล่องข้อความ</p>
        <table class="history-table">
            <tr>
                <th>ส่งโดย</th>
                <th>หัวข้อเรื่อง</th>
                <th>คำอธิบาย</th>
                <th>วันที่</th>
            </tr>
            <tr class="trReading" v-for="feed in feedback" :key="feed.id" @click="feedback_choose = feed, readFeedback()" v-b-modal="'reading'">
                <td>
                    <span v-for="em in email" :key="em.id">
                        <span v-if="em.id === feed.user_id">
                            {{ em.email }}
                        </span>
                    </span>
                </td>
                <td>
                    {{ cutText(feed.title, 30) }}
                </td>
                <td>
                     {{ cutText(feed.description, 30) }}
                </td>
                <td>{{ feed.date }}</td>
            </tr>
        </table>

        <b-modal id="reading" class="text-center" centered hide-header-close hide-footer  :title="feedback_choose.title">
            {{feedback_choose.description}}
            <template>
            <div class="modal-footer" style="color:grey">
               <span v-for="em in email" :key="em.id">
                        <span v-if="em.id === feedback_choose.user_id">
                            {{ em.email }}
                        </span>
                </span>
               {{feedback_choose.date}} ( {{feedback_choose.feedback_time}} )
            </div>
            </template>
            
        </b-modal>

    </div>
</template>

<script>
import axios from "@/plugins/axios";
import "../assets/css/feedback.css";

export default {
    props: ["user"],
    data() {
        return {
            feedback: [],
            email: [],
            feedback_choose: "",
        }
    },
    mounted() {
        this.getFeedback();
    },
    methods: {
        getFeedback() {
            axios.get("feedback")
            .then((response) => {
                this.feedback = response.data.feedback;
                this.email = response.data.email;
            })
            .catch((err) => {
            console.log(err);
            });
        },
        cutText(text, maxLength) {
            if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
            }
            return text;
        },
        readFeedback() {
            // console.log('this.feedback_choose1', this.feedback_choose.id)
            axios
            .get(`/feedback/${this.feedback_choose.id}`)
            .then(() => {
            })
            .catch((error) => {
            console.log(error.response.data.message)

            });
            
        },
    }
}
</script>

