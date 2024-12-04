<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Resep</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Refresh untuk menarik data terbaru -->
      <ion-refresher
        slot="fixed"
        :pull-factor="0.5"
        :pull-min="100"
        :pull-max="200"
        @ionRefresh="handleRefresh($event)"
      >
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Daftar Resep -->
      <div class="scrollable-container">
        <ion-list>
          <ion-item-sliding
            v-for="resep in resepList"
            :key="resep.id"
            :ref="(el) => setItemRef(el, resep.id!)"
          >
            <ion-item-options side="start" @ionSwipe="handleDelete(resep)">
              <ion-item-option
                color="danger"
                expandable
                @click="handleDelete(resep)"
              >
                <ion-icon
                  slot="icon-only"
                  :icon="trash"
                  size="large"
                ></ion-icon>
              </ion-item-option>
            </ion-item-options>

            <ion-item>
              <ion-card>
                <ion-card-header>
                  <ion-card-title class="ion-text-wrap limited-text">{{
                    resep.nama
                  }}</ion-card-title>
                  <ion-card-subtitle class="limited-text">{{
                    resep.deskripsi
                  }}</ion-card-subtitle>
                </ion-card-header>

                <ion-card-content>
                  <ion-badge>{{ getRelativeTime(resep.updatedAt) }}</ion-badge>
                </ion-card-content>
              </ion-card>
            </ion-item>

            <ion-item-options side="end" @ionSwipe="handleEdit(resep)">
              <ion-item-option @click="handleEdit(resep)">
                <ion-icon
                  slot="icon-only"
                  :icon="create"
                  size="large"
                ></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
          <ion-item v-if="resepList.length === 0" class="ion-text-center">
            <ion-label>No recipes available</ion-label>
          </ion-item>
        </ion-list>
      </div>

      <!-- Tombol tambah resep -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="isOpen = true">
          <ion-icon :icon="add" size="large"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <InputModal
        v-model:isOpen="isOpen"
        v-model:editingId="editingId"
        :resep="resep"
        @submit="handleSubmit"
      />
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonFab,
  IonFabButton,
  IonList,
  loadingController,
  IonRefresher,
  IonRefresherContent,
  toastController,
} from "@ionic/vue";
import { add, create, trash, checkmarkCircle, closeCircle } from "ionicons/icons";
import InputModal from "@/components/InputModal.vue";
import { onMounted, ref, computed } from "vue";
import { firestoreService, type Resep } from "@/utils/firestore";
import { formatDistanceToNow } from "date-fns";

const isOpen = ref(false);
const editingId = ref<string | null>(null);
const resepList = ref<Resep[]>([]);
const resep = ref<Omit<Resep, "id" | "createdAt" | "updatedAt">>({
  nama: "",
  deskripsi: "",
  langkah: [],
});
const itemRefs = ref<Map<string, HTMLIonItemSlidingElement>>(new Map());

// Mengatur referensi item
const setItemRef = (el: any, id: string) => {
  if (el) {
    itemRefs.value.set(id, el.$el);
  }
};

// Menampilkan toast notifikasi
const showToast = async (message: string, color: string = "success", icon: string = checkmarkCircle) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: "top",
    icon,
  });
  await toast.present();
};

// Mendapatkan waktu relatif
const getRelativeTime = (date: any) => {
  try {
    const jsDate = date?.toDate ? date.toDate() : new Date(date);
    return formatDistanceToNow(jsDate, { addSuffix: true });
  } catch (error) {
    return "Invalid date";
  }
};

// Memuat data resep
const loadResep = async (isLoading = true) => {
  let loading;
  if (isLoading) {
    loading = await loadingController.create({
      message: "Loading...",
    });
    await loading.present();
  }

  try {
    resepList.value = await firestoreService.getResep();
  } catch (error) {
    console.error(error);
  } finally {
    if (loading) {
      await loading.dismiss();
    }
  }
};

// Saat halaman dimuat
onMounted(() => {
  loadResep();
});

// Handle refresh
const handleRefresh = async (event: any) => {
  try {
    await loadResep(false);
  } catch (error) {
    console.error("Error refreshing:", error);
  } finally {
    event.target.complete();
  }
};

// Handle submit pada modal
const handleSubmit = async (resep: Omit<Resep, "id" | "createdAt" | "updatedAt">) => {
  if (!resep.nama) {
    await showToast("Nama resep wajib diisi", "warning", closeCircle);
    return;
  }
  try {
    if (editingId.value) {
      await firestoreService.updateResep(editingId.value, resep);
      await showToast("Resep berhasil diperbarui", "success", checkmarkCircle);
    } else {
      await firestoreService.addResep(resep);
      await showToast("Resep berhasil ditambahkan", "success", checkmarkCircle);
    }
    loadResep();
  } catch (error) {
    console.error(error);
  } finally {
    editingId.value = null;
  }
};

// Handle delete resep
const handleDelete = async (resep: Resep) => {
  try {
    await firestoreService.deleteResep(resep.id!);
    await showToast("Resep berhasil dihapus", "success", checkmarkCircle);
    loadResep();
  } catch (error) {
    console.error(error);
  }
};

// Handle edit resep
const handleEdit = async (resepEdit: Resep) => {
  const slidingItem = itemRefs.value.get(resepEdit.id!);
  await slidingItem?.close();

  editingId.value = resepEdit.id!;
  resep.value = {
    nama: resepEdit.nama,
    deskripsi: resepEdit.deskripsi,
    langkah: resepEdit.langkah,
  };
  isOpen.value = true;
};
</script>
