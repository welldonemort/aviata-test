<template>
  <div class="results-item">
    <div class="left">
      <div class="top">
        <div class="logo">
          <div class="logo--holder">
            <img
                :src="image_url"
                alt="logo"
                class="logo__img"
            >
            <span class="logo__carrier-name">{{ carrier_name }}</span>
          </div>
          <span class="label--mobile">{{ baggage_amount }}</span>
        </div>
        <div class="schedule">
          <div class="date-from">
            <span class="date">{{ item.itineraries[0][0].segments[0].dep_time.split(" ")[0] + " " + item.itineraries[0][0].segments[0].dep_time.split(" ")[1] + " " + item.itineraries[0][0].segments[0].dep_time.split(" ")[2].toLowerCase() }}</span>
            <span class="time">{{ item.itineraries[0][0].segments[0].dep_time.split(" ")[3] }}</span>
          </div>
          <div class="path">
            <div class="line-description">
              <span class="airport-code">{{ item.itineraries[0][0].segments[0].origin_code }}</span>
              <span class="time">{{ getHoursFromSeconds(props.item.best_time) }}</span>
              <span class="airport-code">{{ item.itineraries[0][0].segments[item.itineraries[0][0].segments.length - 1].dest_code }}</span>
            </div>
            <div class="line">
              <div
                  v-for="idx in item.itineraries[0][0].stops + 2"
                  :key="`segment-${idx}`"
                  class="circle"
              />
            </div>
            <div class="stops">
              <span
                  v-for="idx in item.itineraries[0][0].stops"
                  :key="`segment-${idx}`"
                  class="stop"
              >
                {{ getLayover(idx) }}
              </span>
            </div>
          </div>
          <div class="date-to">
            <span class="date">{{ item.itineraries[0][0].segments[item.itineraries[0][0].segments.length - 1].arr_time.split(" ")[0] + " " + item.itineraries[0][0].segments[item.itineraries[0][0].segments.length - 1].arr_time.split(" ")[1] + " " + item.itineraries[0][0].segments[item.itineraries[0][0].segments.length - 1].arr_time.split(" ")[2].toLowerCase() }}</span>
            <span class="time">{{ item.itineraries[0][0].segments[item.itineraries[0][0].segments.length - 1].arr_time.split(" ")[3] }}</span>
          </div>
        </div>
      </div>
      <div class="bottom">
        <the-button
            text="Детали перелета"
            @clicked="getFlightDetails"
            variant="dashed"
            class="details"
        />

        <the-button
            text="Условия тарифа"
            @clicked="getFlightConditions"
            variant="dashed"
        />

        <div class="no-return">
          <no-return-svg
              v-if="!item.itineraries[0][0].refundable"
              class="no-return__svg"
          />
          <span class="no-return__label">
            {{ item.itineraries[0][0].refundable ? "возвратный" : "невозвратный" }}
          </span>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="price">{{ item.price }} ₸</div>
      <the-button
          text="Выбрать"
          @clicked="chooseFlight"
          variant="green full"
          class="choose-btn"
      />
      <div class="info">
        Цена за всех пассажиров
      </div>
      <div class="baggage">
        <span class="label">{{ baggage_amount }}</span>
        <the-button
            text="+ Добавить багаж"
            @clicked="addBaggage"
            variant="blue-light"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue"
import { FlightT } from "@/core/types/search.types"
import TheButton from "@/components/common/TheButton.vue"
import NoReturnSVG from "@/components/svg/NoReturnSVG.vue"

export default defineComponent({
  components: {
    "the-button": TheButton,
    "no-return-svg": NoReturnSVG,
  },
  props: {
    item: {
      type: Object as PropType<FlightT>,
      default: () => {},
    },
    airlines: {
      type: Object as PropType<any>,
      default: () => {},
    },
  },
  setup(props) {
    const chooseFlight = () => {
      alert("Вы успешно выбрали полёт!")
    }

    const addBaggage = () => {
      alert("Вы успешно добавили багаж!")
    }

    const getFlightDetails = () => {
      alert("Детали перелета!")
    }

    const getFlightConditions = () => {
      alert("Условия тарифа!")
    }

    const getHoursFromSeconds = (seconds: number) => {
      const hours = Math.trunc(seconds / 60 / 60)
      const minutes = seconds / 60 - hours * 60

      return !minutes ? `${hours} ч` : `${hours} ч ${minutes} м`
    }

    const getLayover = (idx: number) => {
      const city = props.item.itineraries[0][0].segments[idx - 1].dest
      const hours_string = getHoursFromSeconds(props.item.itineraries[0][0].layovers[idx - 1])

      let city_arr = city.split("")
      if (city_arr[city_arr.length - 1] === 'а') city_arr[city_arr.length - 1] = 'у'

      return `через ${city_arr.join("")}, ${hours_string}`
    }

    const dep_date = computed(() => {
      return props.item.itineraries && props.item.itineraries[0][0].dep_date?.split(" ")[0]
    })

    const dep_time = computed(() => {
      return props.item.itineraries && props.item.itineraries[0][0].dep_date?.split(" ")[1]
    })

    const arr_date = computed(() => {
      return props.item.itineraries && props.item.itineraries[0][0].arr_date?.split(" ")[0]
    })

    const arr_time = computed(() => {
      return props.item.itineraries && props.item.itineraries[0][0].arr_date?.split(" ")[1]
    })

    const image_url = computed(() => `https://aviata.kz/static/airline-logos/80x80/${props.item.validating_carrier}.png`)

    const carrier_name = computed(() => props.airlines[`${props.item.validating_carrier}`])

    const baggage_amount = computed(() => {
      const key = Object.keys(props.item.services)[0]
      const amount = props.item.services[key].value.split(" ")[0]

      return +amount === 0 ? "Нет багажа" : amount + " кг"
    })

    return {
      props,
      chooseFlight,
      addBaggage,
      getFlightDetails,
      getFlightConditions,
      getHoursFromSeconds,
      getLayover,
      image_url,
      carrier_name,
      baggage_amount,
      dep_date,
      dep_time,
      arr_date,
      arr_time,
    }
  }
})
</script>

<style lang="scss" scoped>
.results-item {
  display: flex;
  width: 100%;
  margin-bottom: 12px;
  background: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 40px 16px;
    width: 100%;
    .top {
      display: flex;
      align-items: center;
      .logo {
        display: flex;
        align-items: center;
        width: 10rem;
        .logo--holder {
          display: flex;
          align-items: center;
        }
        .label--mobile {
          display: none;
        }
        &__img {
          height: 20px;
          width: auto;
          margin-right: 7px;
        }
        &__carrier-name {
          font-weight: 600;
          font-size: 14px;
          line-height: 19px;
        }
      }
      .schedule {
        display: flex;
        align-items: center;
        .date-from,
        .date-to {
          display: flex;
          flex-direction: column;
          align-items: center;
          .date {
            font-size: 12px;
            line-height: 16px;
          }
          .time {
            font-weight: 600;
            font-size: 24px;
            line-height: 33px;
          }
        }
        .path {
          margin: 0 31px;
          .line-description {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 2px;
            .airport-code {
              font-size: 10px;
              line-height: 12px;
              color: #B9B9B9;
            }
            .time {
              font-size: 12px;
              line-height: 18px;
            }
          }
          .line {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 168px;
            height: 1px;
            background: #B9B9B9;
            .circle {
              left: 0;
              width: 5px;
              height: 5px;
              background: #FFFFFF;
              border: 1px solid #B9B9B9;
              border-radius: 50%;
            }
          }
          .stops {
            display: flex;
            justify-content: space-around;
            margin-top: 2px;
            .stop {
              font-size: 12px;
              line-height: 16px;
              color: #FF9900;
            }
          }
        }
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      .details {
        margin-right: 23px;
      }
      .no-return {
        display: flex;
        align-items: center;
        margin-left: 47px;
        &__svg {
          width: 16px;
          height: 16px;
        }
        &__label {
          margin-left: 7px;
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 14px;
          color: #707276;
        }
      }
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #F5F5F5;
    padding: 13px 20px;
    min-width: 240px;
    .price {
      font-family: Arial, sans-serif;
      font-size: 24px;
      line-height: 28px;
      margin-bottom: 13px;
    }
    .info {
      margin: 8px 0 12px;
      color: #707276;
      font-size: 12px;
      line-height: 16px;
    }
    .baggage {
      display: flex;
      align-items: center;
      .label {
        margin-right: 6px;
        font-size: 12px;
        line-height: 16px;
      }
    }
  }
}

@media(max-width: 800px) {
  .results-item {
    flex-direction: column;
    .left {
      padding: 18px 20px 28px;
      .top {
        flex-direction: column;
        .logo {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 27px;
          .logo--holder {
            display: flex;
            align-items: center;
          }
          .label--mobile {
            display: initial;
            font-size: 12px;
            line-height: 16px;
          }
        }
        .schedule {
          width: 100%;
          position: relative;
          justify-content: space-between;
          margin-bottom: 60px;
          .path {
            width: 100%;
            position: absolute;
            top: 79px;
            left: 0;
            margin: 0;
            .line {
              width: 100%;
            }
          }
        }
      }
      .bottom {
        display: none;
      }
    }
    .right {
      .baggage {
        display: none;
      }
      .choose-btn {
        width: 70%;
      }
    }
  }
}
</style>