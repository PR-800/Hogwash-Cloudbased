<template>
    <div class="history-border">
        <p style="font-size: 40px;font-weight: bold;">ประวัติการใช้งาน</p>
        <table class="history-table">
            <tr >
                <th>วันที่ใช้งาน</th>
                <th>เวลาเริ่มใช้งาน</th>
                <th>เครื่องที่ใช้</th>
                <th>รูปแบบการซัก</th>
                <th>ช่องทางการชำระเงิน</th>
            </tr>
            <tr v-for="hist in history" :key="hist.id">
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
            history: [],
            payment: [],
            option: []
        }
    },
    mounted() {
        this.getHistory();
    },
    methods: {
        getHistory() {
            axios.get("history")
            .then((response) => {
                this.history = response.data.history;
                this.payment = response.data.payment;
                this.option = response.data.option;
            })
            .catch((err) => {
            console.log(err);
            });
        },
    }
}
</script>

