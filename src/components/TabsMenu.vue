<template>
    <ion-tabs>
        <ion-router-outlet></ion-router-outlet>

        <ion-tab-bar slot="bottom">
            <!-- Resep Tab -->
            <ion-tab-button tab="recipe" href="/recipe" layout="icon-top">
                <ion-icon :icon="restaurant"></ion-icon>
                <ion-label>Resep</ion-label>
            </ion-tab-button>

            <!-- Profile Tab -->
            <ion-tab-button tab="profile" href="/profile" layout="icon-top">
                <ion-icon :icon="person"></ion-icon>
                <ion-label>Profile</ion-label>
            </ion-tab-button>
        </ion-tab-bar>
    </ion-tabs>
</template>

<script setup lang="ts">
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/vue';
import { restaurant, person } from 'ionicons/icons';  // Menggunakan ikon yang lebih relevan
</script>
