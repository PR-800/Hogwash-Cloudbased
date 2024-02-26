<template>
    <div class="history-border">
        <p style="font-size: 40px;font-weight: bold;">ประวัติการใช้งานทั้งหมด</p>
        <table class="history-table">
            <tr >
                <th>วันที่ใช้งาน</th>
                <th>เวลาเริ่มใช้งาน</th>
                <th>เครื่องที่ใช้</th>
                <th>รูปแบบการซัก</th>
                <th>ช่องทางการชำระเงิน</th>
                <th>ชื่อผู้ใช้งาน</th>
            </tr>
            <tr v-for="hist in allHistory" :key="hist.id">
                <td>{{ hist.justdate }}</td>
                <td>{{ hist.time }}</td>
                <td>{{ hist.wm_id }}</td>
                <td>
                    <span v-for="op in option" :key="op.id">
                        <span v-if="op.id === hist.option_id">
                            {{ op.name }}
                        </span>
                    </span>
                </td>
                <td>
                    <span v-for="pay in payment" :key="pay.id">
                        <span v-if="pay.id === hist.payment_id">
                            {{ pay.name }}
                        </span>
                    </span>
                </td>
                <td>
                    <span v-for="user in users" :key="user.id">
                        <span v-if="user.id === hist.user_id">
                            {{ user.email }}
                        </span>
                    </span>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import axios from "@/plugins/axios";
import "../assets/css/history.css";

export default {
    props: ["user"],
    data() {
        return {
            allHistory: [],
            payment: [],
            option: [],
            users: [],
        }
    },
    mounted() {
        this.getAllHistory();
    },
    methods: {
        getAllHistory() {
            axios.get("historylist")
            .then((response) => {
                this.allHistory = response.data.allHistory;
                this.payment = response.data.payment;
                this.option = response.data.option;
                this.users = response.data.users;
            })
            .catch((err) => {
            console.log(err);
            });
        },
    }
}
</script>

