<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <div id="container">
                <!-- Title -->
                <ion-text style="margin-bottom: 20px; text-align: center;">
                    <h1>Welcome to Resep Remy untuk Dunia (Ratatouille)</h1>
                    <p>Your ultimate recipe collection</p>
                </ion-text>

                <!-- Button Sign In -->
                <ion-button @click="login" color="primary">
                    <ion-icon slot="start" :icon="logoGoogle"></ion-icon>
                    <ion-label>Sign In to Explore Recipes</ion-label>
                </ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonButton, IonIcon, IonText, IonLabel } from '@ionic/vue';
import { logoGoogle } from 'ionicons/icons';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Fungsi login dengan Google
const login = async () => {
    await authStore.loginWithGoogle();
};
</script>

<style>
#container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    padding: 20px;
    text-align: center;
}

ion-button {
    --border-radius: 12px;
    --background: #ff9800;
    --background-activated: #f57c00;
    --background-focused: #ff9800;
    color: white;
    font-weight: bold;
}

ion-text h1 {
    font-size: 2.5rem;
    color: #ff5722;
    margin-bottom: 10px;
}

ion-text p {
    font-size: 1.2rem;
    color: #757575;
    margin-bottom: 20px;
}
</style>
