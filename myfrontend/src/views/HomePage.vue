<template>
  <div>
    <div id="home">
      <!-- div 1 -->
      <div id="home1">
        <div class="intro">
          <div class="slogan">
            <p style="font-size: 80px">HogWash<br />Laundry</p>
            <p>ระบบให้บริการซักผ้า</p>
            <p>โดยไม่ต้องใช้เหรียญ</p>
          </div>
          <div class="vl"></div>
          <div class="detail">
            <table>
              <tr>
                <th id="detail-table">ซักเร็ว</th>
                <th id="detail-table">ซักธรรมดา</th>
              </tr>
              <tr>
                <td id="detail-table">
                  20 บาท <br />
                  <div class="hl"></div>
                  30 นาที
                </td>
                <td id="detail-table">
                  30 บาท <br />
                  <div class="hl"></div>
                  50 นาที
                </td>
              </tr>

              <tr>
                <th id="detail-table">ซักน้ำร้อน</th>
                <th id="detail-table">ซักน้ำเย็น</th>
              </tr>
              <tr>
                <td id="detail-table">
                  50 บาท <br />
                  <div class="hl"></div>
                  50 นาที
                </td>
                <td id="detail-table">
                  50 บาท <br />
                  <div class="hl"></div>
                  50 นาที
                </td>
              </tr>
            </table>
          </div>
        </div>
        <a href="#home2" class="arrow-container">
          <div class="arrow-down"></div>
          <div class="arrow-down"></div>
          <div class="arrow-down"></div>
        </a>
      </div>
      <!-- div 2 -->
      <div id="home2">
        <a href="#home1" class="arrow-container">
          <div class="arrow-up"></div>
          <div class="arrow-up"></div>
          <div class="arrow-up"></div>
        </a>
        <!-- Washing Machine cards -->
        <div class="allCard">
          <div class="row justify-content-center groupCard my-2">
            <div class="col-3" v-for="wm in wms" :key="wm.id">
              <div
                :class="[
                  'card wmCard',
                  wm.status == 0 ? ' border0' : '',
                  wm.status == 1 ? ' border1' : '',
                  wm.status == 2 ? ' border2' : '',
                ]"
              >
                <h3 class="card-title wmCard-title">{{ wm.id }}</h3>
                <img
                  class="card-img-top"
                  :src="imagePath(images[0].path)"
                  style="padding: 1"
                />
                <div class="card-body" style="padding-top: 2">
                  <!------------------------------ powder & softener --------------------------------------------- -->
                  <table id="product_table">
                    <tr>
                      <td>
                        <img
                          class="product_img"
                          :src="imagePath(images[1].path)"
                        />
                      </td>
                      <td>
                        <img
                          class="product_img"
                          :src="imagePath(images[2].path)"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p class="card-title wmCard-text">
                          <small class="text-muted"> {{ wm.powder }}%</small>
                        </p>
                      </td>
                      <td>
                        <p class="card-title wmCard-text">
                          <small class="text-muted"> {{ wm.softener }}%</small>
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- status border -->

                  <div v-show="wm.status == 0">
                    <h4 class="card-title wmCard-text">
                      <div style="color: #7ccf85">สถานะ : ว่าง</div>
                    </h4>

                    <b-button v-if="user && user.role == 'admin'"
                    @click="refill_choose = wm;"
                    v-b-modal="'refillConfirm'"
                    class="selectWm"
                    style="background-color: #7ccf85; color: white; border:none;"> 
                      Refill
                    </b-button>

                    <b-button v-if="(user && user.role == 'customer') && (wm.powder != 0 && wm.softener != 0)"
                      v-b-modal="'available'"
                      :class="['selectWm']"
                      style="background-color: #7ccf85; color: white; border:none;"
                      @click="
                        wm.status = 2;
                        wm_choose = wm;
                      "
                    >
                      เลือกใช้งาน
                    </b-button>

                    <b-button v-if="(user && user.role == 'customer') && (wm.powder == 0 || wm.softener == 0)"
                      :class="['selectWm']"
                      style="background-color: #7ccf85; color: white; border:none;" disabled>
                      ไม่สามารถใช้งานได้
                    </b-button>
                  </div>

                  <div v-show="wm.status == 1">
                    <h4 class="card-title wmCard-text">
                        <div v-for="(output, index) in formattedTimerOutput" :key="index" style="color: #dd6060">
                          <span v-if="index == wm.id-1">{{ output }}</span>
                        </div>
                    </h4>
                    <b-button 
                      v-if="user && user.role == 'customer' && !isUser(wm) && !isInQueue.some(queueItem => queueItem.user_id === user.id && queueItem.wm_id === wm.id)"
                      v-b-modal="'queue'"
                      class="selectWm"
                      style="background-color: #dd6060; color: white; border:none;"
                      @click="wm_choose = wm"
                    >
                      จองคิว
                    </b-button>
                    <b-button disabled 
                      v-if="user && user.role == 'customer' && isUser(wm)"
                      class="selectWm"
                      style="background-color: #dd6060; color: white; border:none;"
                    >
                      กำลังใช้งาน
                    </b-button>
                    <b-button 
                      v-if="user && user.role == 'customer' && !isUser(wm) && isInQueue.some(queueItem => queueItem.user_id === user.id && queueItem.wm_id === wm.id)"
                      v-b-modal="'checkQueue'"
                      class="selectWm"
                      style="background-color: #dd6060; color: white; border:none;"
                      @click="wm_choose = wm;"
                    >
                      ตรวจสอบคิว
                    </b-button>
                  </div>

                  <div v-show="wm.status == 2">
                    <h4 class="card-title wmCard-text">
                      <div style="color: #f1d438">อยู่ระหว่างดำเนินการ</div>
                    </h4>
                    <b-button v-if="user && user.role == 'customer'"
                      class="selectWm"
                      style="background-color: #f1d438; color: white; border:none;"
                    >
                      รอสักครู่
                    </b-button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- modal available -->
        <b-modal id="available" size='lg' centered hide-footer hide-header no-stacking data-backdrop="static" data-keyboard="false"  no-close-on-backdrop>
          <template>
            <h1 class="modal-title w-100 text-center">
              เลือกรูปแบบการซัก
            </h1>
            <br>
            <div class="row">
              <div class="col-6" v-for="option in options" :key="option.id">
                <b-button
                  v-b-modal="'selectPayment'"
                  class="col btn selectOption"
                  variant="light"
                  @click="option_choose = option; wms[wm_choose.id-1].time = option.time;"
                >
                  <h5>{{ option.name }}</h5>
                  <small
                    >{{ option.price }} บาท / {{ option.time / 60 }} นาที</small
                  >
                </b-button>
              </div>
            </div>
            <div class="modal-footer">
              <b-button variant="outline-secondary" block @click="$bvModal.hide('available'); wm_choose.status = 0;">
                Close
              </b-button>
            </div>
          </template>
        </b-modal>

        <!-- selectPayment -->
        <b-modal id="selectPayment" size='lg' centered hide-footer hide-header no-stacking  no-close-on-backdrop>
          <template>
            <h1 class="modal-title w-100 text-center">
              ช่องทางการชำระเงิน
            </h1>
            <br>
            <div class="row">
              <div class="col-6" v-for="payment in payments" :key="payment.id">
                <b-button
                  v-b-modal="'confirmPayment'"
                  class="col btn selectOption"
                  variant="light"
                  @click="payment_choose = payment;"
                >
                  <img :src="imagePath(payment.path)" />
                  <span></span>
                  <b>  {{ payment.name }}</b>
                </b-button>
              </div>
            </div>
            <div class="modal-footer">
              <b-button v-b-modal="'available'" variant="outline-secondary">
                Back
              </b-button>
              <b-button variant="outline-secondary" block @click="$bvModal.hide('selectPayment'); wm_choose.status = 0;">
                Close
              </b-button>
            </div>
          </template>
        </b-modal>

        <!-- confirmPayment -->
        <b-modal id="confirmPayment" size='lg' centered hide-footer hide-header no-stacking no-close-on-backdrop>
          <template>
            <h1 class="modal-title w-100 text-center">
              ยืนยันการชำระเงินเสร็จสิ้น
            </h1>
            <div class="modal-body confirmedText">
              <p>กรุณารอสักครู่ ระบบกำลังเตรียมดำเนินการ</p>
              <p style="color: #dd6060">! ข้อควรระวัง !</p>
              <p style="color: #dd6060">
                โปรดตรวจสอบให้แน่ใจว่านําผ้าใส่ถังซักเรียบร้อยแล้วก่อนกดยืนยัน
              </p>
              <input
                type="checkbox"
                class="form-check-input"
                @click="paymentCheck = !paymentCheck"
              />
              <a style="font-size:20px;margin-left:5px;cursor:none;cursor: default">รับทราบ</a> <br /><br />
              <b-button
                :class="['btn confirmed', paymentCheck ? '' : ' disabled']"
                style="background-color: #59a8b9; color: white"
                block @click="$bvModal.hide('confirmPayment'); paymentCheck = false; wm_choose.status = 1; addHistory();   
                              isFetch = false; fetchData(); startTimer(wm_choose); "
              >
                ยืนยัน
              </b-button>
            </div>
          </template>
        </b-modal>

        <!-- modal queue -->
        <b-modal id="queue" size='lg' centered hide-footer hide-header no-stacking no-close-on-backdrop>
          <template>
            <h1 class="modal-title my-4 w-100 text-center">
              เครื่องไม่พร้อมใช้งานในขณะนี้<br />
              เนื่องจากมีการใช้งานอยู่
            </h1>
            <span v-for="queueNum in queueNums" :key="queueNum.id">
              <p class="text-muted" v-show="wm_choose.id == queueNum.wm_id" style="font-size: 25px">
                จำนวนคิวต่อใช้งานขณะนี้ : {{ queueNum.number }}
              </p>
            </span>
            <div>
              <b-button
                v-b-modal="'queue2'"
                class="btn queueOption"
                style="background-color: #59a8b9; color: white"
              >
                จองคิว
              </b-button>
              <b-button
                class="btn queueOption"
                style="background-color: #b3b3b3; color: white"
                block @click="$bvModal.hide('queue')"
              >
                ยกเลิก
              </b-button>
            </div>
            <!-- <small class="text-muted py-2" style="font-size:15px">จำนวนคิวต่อใช้งานในขณะนี้ : 1</small> -->
          </template>
        </b-modal>

        <!-- modal page2 queue -->
        <b-modal id="queue2" size='lg' centered hide-footer hide-header no-stacking no-close-on-backdrop>
          <div class="modal-content rounded-4">
            <h1 class="modal-title w-100 text-center">
              ยืนยันการจองหรือไม่
            </h1>
            <span v-for="queueNum in queueNums" :key="queueNum.id">
              <span class="text-muted" v-show="wm_choose.id == queueNum.wm_id">
                <p class="modal-title w-100 text-center" style="font-size: 25px">
                  ลำดับคิวของคุณ : 
                  {{ queueNum.number + 1 }}
                </p>
              </span>
            </span>
              
            <div class="modal-body">
              <b-button
                v-b-modal="'queue3'"
                class="btn queueOption"
                style="background-color: #59a8b9; color: white"
                @click="addQueue(wm_choose); isFetch = false; fetchData();"
              >
                ยืนยัน
              </b-button>
              <b-button
                class="btn queueOption"
                style="background-color: #b3b3b3; color: white"
                block @click="$bvModal.hide('queue2')"
              >
                ยกเลิก
              </b-button>
            </div>
          </div>
        </b-modal>

        <!-- modal page3 queue confirmed -->
        <b-modal id="queue3" size='lg' centered hide-footer hide-header no-stacking no-close-on-backdrop>
            <div class="modal-content rounded-4">
                <h1 class="modal-title w-100 text-center">
                  ยืนยันการจองเสร็จสิ้น
                </h1>
              <div class="modal-body">
                <h5>ระบบจะแจ้งให้ทราบเมื่อถึงคิวของคุณ</h5>
                <h5>และโปรดยืนยันการใช้งานต่อภายในเวลาที่กำหนด</h5>
                <br />
                <b-button
                  type="button"
                  class="btn confirmed"
                  style="background-color: #59a8b9; color: white"
                  block @click="$bvModal.hide('queue3');"
                >
                  เข้าใจแล้ว
                </b-button>
              </div>
            </div>
        </b-modal>

        <!-- got queue -->
        <b-modal id="gotQueue" size='lg' centered hide-footer hide-header no-stacking no-close-on-backdrop
          v-model="showGotQueueModal">
          <div class="modal-content rounded-4">
            <div class="modal-header" style="border: none; margin-top: 0px">
              <h1 class="modal-title w-100 text-center">
                ถึงคิวการใช้งานของคุณแล้ว
              </h1>
            </div>
            <div class="modal-body">
              <h5>เครื่องซักผ้าหมายเลข : 
                {{ nextQueue.wm_id }}
              </h5>
              <h5 style="color: #dd6060">
                <p><b>กรุณายืนยันการใช้งานต่อ</b></p>
              </h5>
              <b-button
                v-b-modal="'available'"
                class="btn queueOption"
                style="background-color: #59a8b9; color: white"
                @click="showGotQueueModal = false"
              >
                ยืนยันการใช้งานต่อ
              </b-button>
              <b-button
                class="btn queueOption"
                style="background-color: #dd6060; color: white"
                @click="showGotQueueModal = false"
                v-b-modal="'cancelQueue'"
              >
                ยกเลิกคิว
              </b-button>
            </div>
          </div>
        </b-modal>

        <!-- จองไปแล้วและกดเครื่องเดิมซํ้า  => ตรวจสอบคิว -->
        <b-modal id="checkQueue" size='lg' centered hide-footer hide-header no-stacking no-close-on-backdrop>
            <div class="modal-content rounded-4">
              <div class="modal-header" style="border: none;">
                <h1 class="modal-title w-100 text-center">
                  <span v-for="queueNum in queueNums" :key="queueNum.id">
                    <span class="text-muted" v-show="wm_choose.id == queueNum.wm_id">
                      <p class="modal-title w-100 text-center" style="font-size: 25px">
                        ลำดับคิวของคุณ : 
                        {{ queueNum.number }}
                      </p>
                    </span>
                  </span>
                </h1>
              </div>
              <div class="modal-body">
                <b-button
                  class="btn queueOption"
                  style="background-color: #59a8b9; color: white"
                  block @click="$bvModal.hide('checkQueue')"
                >
                  ยืนยัน
                </b-button>
                <b-button
                  class="btn queueOption"
                  v-b-modal="'cancelQueue'"
                  style="background-color: #dd6060; color: white"
                >
                  ยกเลิกคิว
                </b-button>
              </div>
            </div>
        </b-modal>

        <!-- ยกเลิกคิว -->
        <b-modal id="cancelQueue" size='lg' centered hide-footer hide-header no-stacking no-close-on-backdrop>
            <div class="modal-content rounded-4">
                <h1 class="modal-title w-100 text-center">
                  ยืนยันการยกเลิกคิวปัจจุบัน
                </h1>
              <div class="modal-body">
                <b-button
                  v-b-modal="'available'"
                  class="btn queueOption"
                  style="background-color: #59a8b9; color: white"
                >
                  ไม่ดีกว่า
                </b-button>
                <b-button
                  class="btn queueOption"
                  style="background-color: #dd6060; color: white"
                  block @click="$bvModal.hide('cancelQueue'); deleteQueue(nextQueue.id)"
                >
                  ยืนยันการยกเลิก
                </b-button>
              </div>
            </div>
        </b-modal>

        <!-- จองไปแล้วและไปกดเครื่องอื่น -->
        <b-modal id="inQueue" size='lg' centered hide-footer hide-header no-stacking no-close-on-backdrop>
            <div class="modal-content rounded-4">
              <div class="modal-header" style="border: none;">
                <h1 class="modal-title w-100 text-center">
                  ขณะนี้คุณอยู่ในลำดับคิวการใช้งาน<br />
                  ของเครื่องหมายเลข 003
                </h1>
              </div>
              <div class="modal-body">
                <b-button
                  class="btn confirmed"
                  style="background-color: #59a8b9; color: white"
                  block @click="$bvModal.hide('inQueue')"
                >
                  เข้าใจแล้ว
                </b-button>
              </div>
            </div>
        </b-modal>

        <!-- ซักเสร็จแล้วเย่ -->
        <b-modal id="completed" size='lg' centered hide-footer hide-header no-stacking no-close-on-backdrop
          v-model="showFinishModal">
          <div class="modal-content rounded-4">
            <div class="modal-header" style="border: none; margin-top: 0px">
              <h1 class="modal-title w-100 text-center">
                ผ้าของคุณซักเสร็จเรียบร้อยแล้ว
              </h1>
            </div>
            <div class="modal-body">
              <h5>เครื่องซักผ้าหมายเลข : 
                {{ finish_wm.id }}
              </h5>
              <h5 style="color: #dd6060">
                <p><b>กรุณานำผ้าออกจากเครื่องก่อนกดยืนยัน</b></p>
              </h5>
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="finishCheckbox"
                  @click="finishCheck = !finishCheck"
                />
                <label for="finishCheckbox" style="font-size: 18px; margin-left: 10px; cursor: pointer;user-select: none;">
                  นำผ้าออกจากเครื่องเรียบร้อยแล้ว
                </label>
                <br /><br />
                <!-- นำผ้าออกจากเครื่องเรียบร้อยแล้ว <br /><br /> -->
                <button
                  type="button"
                  :class="['btn confirmed', finishCheck ? '' : ' disabled']"
                  style="background-color: #59a8b9; color: white"
                  @click="$bvModal.hide('completed'); finishCheck = false; showFinishModal = false; resetWm(finish_wm.id); isFetch = false; fetchData()"
                >
                  ยืนยัน
                </button>
            </div>
          </div>
        </b-modal>

      </div>

      <b-modal id="refillConfirm" size='lg' centered hide-footer hide-header no-stacking no-close-on-backdrop>
        <template>
          <h1 class="modal-title my-4 w-100 text-center">
            ยืนยันการเติมเครื่องซักผ้า {{refill_choose.id}}
          </h1>
          <div>
            <div class="modal-body confirmedText">
            <p style="color: #dd6060">! ข้อควรระวัง !</p>
            <p style="color: #dd6060">
              โปรดตรวจสอบให้แน่ใจว่าทำการเติมผงซักฟอกและน้ำยาปรับผ้านุ่มแล้วก่อนกดยืนยัน
            </p>
            <input
              type="checkbox"
              class="form-check-input"
              @click="refillCheck = !refillCheck"
            />
            <a style="font-size:20px;margin-left:5px;cursor:none;cursor: default">รับทราบ</a> <br /><br />
            <b-button
              :class="['btn queueOption', refillCheck ? '' : ' disabled']"
              style="background-color: #59a8b9; color: white"
              block @click="refill(), $bvModal.hide('refillConfirm'); refillCheck = false"
            >
              ยืนยัน
            </b-button>
            <b-button
              class="btn queueOption"
              style="background-color: #b3b3b3; color: white"
              block @click="$bvModal.hide('refillConfirm'); refillCheck = false"
            >
              ยกเลิก
            </b-button>
          </div>
          </div>
        </template>
      </b-modal>

    </div>
    
      <header v-if="(user && (user.role == 'customer' || user.role == 'admin')) && announcement[0].announce != ''" :class="{'headroom--unpinned': scrolled}"  v-on="handleScroll()" class="headroom header">
      {{ announcement[0].announce }} !!
      </header>

  </div>
</template>

<script>
import axios from "@/plugins/axios";

export default {
  name: "HomePage",
  props: ["user"],
  data() {
    return {
      // modal_choose: false,
      // choose_id: '',
      finishCheck: false,
      paymentCheck: false,
      refillCheck: false,
      // online: false,
      // online_user: '',
      // in_queue: false,

      wm_choose: "",
      option_choose: "",
      payment_choose: "",
      refill_choose: "",
      // time_cost: 0,
      // pay_choose: '',
      
      timerOutput:  [],

      wms: [],
      images: [],
      options: [],
      payments: [],
      queueNums: [],

      isFetch: false,

      limitPosition: 500,
      scrolled: false,
      lastPosition: 0,
      announcement: [""],

      isInQueue: [],
      nextQueue: "",
      showGotQueueModal: false,
      showFinishModal: false,

      finish_wm: "",
    };
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);

    axios.get('/timers')
      .then(response => {
        const timers = response.data.timer;

        timers.map(timer => {
          this.startTimer(timer);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  mounted() {
    this.getWM();
    this.getAnnoucement();
    this.getQueue();
  },
  computed: { 
    formattedTimerOutput() {  // ทำให้เวลารันบนจอ
      return this.timerOutput.map((time) => {
        const timeDif = time * 1000;
        const Seconds = Math.floor((timeDif / 1000) % 60);
        const Minutes = Math.floor((timeDif / (60 * 1000)) % 60);
        const Hours = Math.floor((timeDif / (60 * 60 * 1000)) % 24);
        return `${this.padZero(Hours)}:${this.padZero(Minutes)}:${this.padZero(Seconds)}`;
      });
    },
  },
  methods: {
    getWM() {
      axios
        .get("/")
        .then((response) => {
          this.wms = response.data.wms;
          this.images = response.data.images;
          this.options = response.data.options;
          this.payments = response.data.payments;
          this.queueNums = response.data.queueNums;
          // console.log(this.queueNums)
        })
        .catch((err) => {
          console.log(err);
        });
    },
    imagePath(file_path) {
      if (file_path) {
        return "http://localhost:3000/" + file_path;
      }
    },
    addHistory() {
      // console.log("payment_choose.id : ", this.payment_choose.id)
      axios
        .post("/history", {
          params: {
            wm_choose: this.wm_choose.id,
            option_choose: this.option_choose.id,
            payment_choose: this.payment_choose.id,
            wm_time: this.wm_choose.time
          },
        })
        .then(() => {
          console.log('add history')
          this.isFetch = false
          this.fetchData()
        })
        .catch((err) => {
          console.log(err);
        });
    },
    refill() {
      console.log('this.refill_choose : ', this.refill_choose)
      axios
        .put(`/${this.refill_choose.id}`,{})
        .then(() => {
          this.isFetch = false
          this.fetchData()
        })
        .catch((error) => {
          console.log(error.response.data.message)
          
        });
    },
    handleScroll() {
      if (this.lastPosition < window.scrollY && this.limitPosition < window.scrollY) {
        this.scrolled = true;
        // move up!
      } 
      
      if (this.lastPosition > window.scrollY) {
        this.scrolled = false;
        // move down
      }
      
      this.lastPosition = window.scrollY;
      // this.scrolled = window.scrollY > 250;
    },
    getAnnoucement() {
      axios.get("/announcement")
        .then((response) => {
            this.announcement = response.data.announcement;
            // console.log('this.announcement', this.announcement)
        })
        .catch((err) => {
        console.log(err);
        });
    },
    startTimer(choose) { // ทำเป็นวันกว่าจะได้ ********* ห้ามแก้ !!!! ***********
      const wmTimer_choose = this.wms.find(data => data.id === choose.id);
  
      if (wmTimer_choose && wmTimer_choose.time > 0) {
        this.$set(this.timerOutput, wmTimer_choose.id - 1, wmTimer_choose.time); // $set เป็น vue instance (build in) --> set(item, index, value)

        const current_time = Date.now();
        const timeFinish = new Date(current_time + wmTimer_choose.time * 1000 + 1000);

        const timerId = setInterval(() => {
          const timeNow = Date.now();
          const timeDif = timeFinish - timeNow;

          if (timeDif <= 0) {
            clearInterval(timerId);
            // console.log(this.user.id + " " + wmTimer_choose.used_by)
            // this.finish_wm.push(this.user.id, wmTimer_choose.id) 
            // console.log(this.finish_wm)
            // if (this.user && (this.user.id == wmTimer_choose.used_by)) {
            //   this.showFinishModal = true;
            //   this.finish_wm[this.user.id].push(wmTimer_choose.id) 
            //   console.log(this.finish_wm)
            // }
            axios
            .put(`/finish/${wmTimer_choose.id}`)
            .then((res) => {
              this.finish_wm = res.data
              console.log('finish wm : ', this.finish_wm)
              if (this.user && (this.user.id == this.finish_wm.used_by)) {
                this.showFinishModal = true;
              }
              this.isFetch = false
              this.fetchData()
            })
            .catch((error) => {
              console.log(error.response.data.message)
            });

            this.deleteQueue(wmTimer_choose.id);

          } else {
            // const timeNow = Date.now();
            // const timeDif = timeFinish - timeNow; // มันเก็บ datetime เป็น millisec (1 sec = 1000 millisec)

            this.$set(this.timerOutput, wmTimer_choose.id - 1, timeDif / 1000);
      
            let data = {
              id: wmTimer_choose.id,
              time: timeDif / 1000
            }
            axios.post('/timers', data)
              .then(() => {
                // console.log('timer posted')
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }, 1000);
      }
    },
    padZero(value) { // ทำให้เป็น 00 01
      return String(value).padStart(2, '0'); 
    },
    fetchData() { // ทำให้ข้อมูลเปลี่ยนโดยไม่ต้องรีหน้า
      // console.log(this.isFetch)
      setTimeout(this.fetchData, 500);
      if (!this.isFetch) {
        axios
          .get("/")
          .then((response) => {
            this.wms = response.data.wms;
            this.queueNums = response.data.queueNums;
          })
          .catch((err) => {
            console.log(err);
          });
        setTimeout(() => { this.isFetch = true; }, 500);
      }
    },
    isUser(wm) {
      if (!this.user) return false
      return wm.used_by === this.user.id
    },
    addQueue(wm_choose) {
      let data = {
        wm_id: wm_choose.id
      }
      axios
        .post("/queue", data)
        .then(() => {
          console.log('queue added')
          this.isFetch = false
          this.fetchData()
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteQueue(id) {
      axios
        .delete(`/queue/` + id)
        .then((res) => {
          console.log('delete queue')
          if (res) {
            this.nextQueue = res.data.nextQueue
            // console.log('next queue user id = ', this.nextQueue.user_id)
            // console.log('current user id : ', this.user.id)
            if (this.user && this.nextQueue && (this.user.id == this.nextQueue.user_id) ) {
              this.showGotQueueModal = true;
            }
            // else if (this.user && this.nextQueue && (this.user.id != this.nextQueue.user_id)) {
            //   this.pendingQueue(this.nextQueue, 2)
            // }
          }
          this.isFetch = false
          this.fetchData()
        })
        .catch((error) => {
          console.log(error.response)
        });
    },
    getQueue() {
      axios
      .get(`/queue/`)
      .then((res) => {
        console.log('check done')
        this.isInQueue = res.data.queue
        // console.log("this.isInQueue = ", this.isInQueue)

        this.isFetch = false
        this.fetchData()
      })
      .catch((error) => {
        console.log(error.response)
      });
    },
    resetWm(id) {
      axios
      .put(`/reset/` + id)
      .then(() => {
        console.log('reset done')
        this.isFetch = false
        this.fetchData()
      })
      .catch((error) => {
        console.log(error.response)
      });
    }
  },
};
</script>
