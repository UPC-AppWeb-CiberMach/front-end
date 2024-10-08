<template>
  <pv-dialog header="Confirm Deletion" v-model:visible="showConfirmDialog" :modal="true" :closable="false" :style="{ backgroundColor: '#ffffff', color: '#262626' }" aria-label="Diálogo de confirmación de eliminación">
    <p>Are you sure you want to delete this reservation?</p>
    <template #footer>
      <pv-button label="No" @click="showConfirmDialog = false" aria-label="No"></pv-button>
      <pv-button label="Yes" @click="deleteReservation" aria-label="Sí"></pv-button>
    </template>
  </pv-dialog>

  <div class="card bg-white text-black" aria-label="Lista de reservas">
    <pv-dataview :value="reservations" paginator :rows="5">
      <template #list="slotProps">
        <div class="flex flex-column">
          <div v-for="(item, index) in slotProps.items" :key="index" aria-label="Reserva {{ index + 1 }}">
            <div class="flex flex-column sm:flex-row sm:align-items-center p-6 gap-4 bg-white text-black border-top-1 border-300">
              <div class="relative w-full md:w-4">
                <img class="block xl:block mx-auto border-round-md w-3 h-auto" :src="item.scooter.image" :alt="item.scooter.model" aria-label="Imagen del scooter" />
              </div>
              <div class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-6">
                <div class="flex flex-row md:flex-column justify-content-between align-items-left gap-2">
                  <div>
                    <span class="font-medium text-black text-sm" aria-label="Fecha: {{ item.start_date }}">Fecha: {{ item.start_date }}</span>
                    <div class="text-lg font-medium mt-2" aria-label="Modelo: {{ item.scooter.model }}">Modelo: {{ item.scooter.model }}</div>
                  </div>
                  <div class="bg-gray-200 p-1 border-round">
                    <div class="bg-white flex align-items-center gap-2 justify-content-center py-1 px-2 border-round">
                      <span class="text-black font-medium text-sm" aria-label="Calificación: {{ item.rating }}">Calificación: {{ item.rating }}</span>
                      <i class="pi pi-star-fill text-yellow-500"></i>
                    </div>
                  </div>
                </div>
                <div class="flex flex-column md:align-items-end gap-8">
                  <span class="text-xl font-semibold" aria-label="{{ item.time }} horas">{{ item.time }} hrs</span>
                  <div class="flex flex-row-reverse md:flex-row gap-2">
                    <pv-button class="pink-button" label="Delete" @click="confirmDelete(item.id)" aria-label="Eliminar"></pv-button>
                    <pv-button label="View details" class="flex-auto md:flex-initial whitespace-nowrap green-button" @click="viewDetails(item.id)" aria-label="Ver detalles"></pv-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </pv-dataview>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { HistoryServices } from "@/movirent/history-scooter/services/history-services.js";
import { useRouter } from "vue-router";

const reservations = ref([]);
const currentUser = JSON.parse(sessionStorage.getItem("user"));
const clientId = currentUser?.id;
console.log("user id:", clientId);

const showConfirmDialog = ref(false);
const reservationToDelete = ref(null);
const router = useRouter();

onMounted(async () => {
  try {
    const response = await new HistoryServices().getReserveByClientId(clientId);
    const reservationsData = response.data;

    const reservationsWithScooters = await Promise.all(reservationsData.map(async (reservation) => {
      const scooterResponse = await new HistoryServices().getScooterById(reservation.scooter_id);
      reservation.scooter = scooterResponse.data;
      return reservation;
    }));

    console.log("Reservations data:", reservationsWithScooters);
    reservations.value = reservationsWithScooters;
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }
});

const confirmDelete = (id) => {
  reservationToDelete.value = id;
  showConfirmDialog.value = true;
};

const deleteReservation = async () => {
  try {
    await new HistoryServices().deleteReservationById(reservationToDelete.value);
    reservations.value = reservations.value.filter(reservation => reservation.id !== reservationToDelete.value);
    showConfirmDialog.value = false;
  } catch (error) {
    console.error("Error deleting reservation:", error);
  }
};

const viewDetails = (id) => {
  router.push({ path: `/reservation/${id}` });
};
</script>

<style scoped>
.card {
  background-color: #ffffff;
  color: #262626;
}

.text-black {
  color: #262626;
}

.bg-white {
  background-color: #ffffff;
}
.bg-gray-200 {
  margin-left: 1px;
  width: 75%;
}

.green-button {
  background-color: #72D063;
  border: none;
  margin-right: 20px;
}
.pink-button {
  background-color: #FD6C6C;
  border: none;
}
</style>