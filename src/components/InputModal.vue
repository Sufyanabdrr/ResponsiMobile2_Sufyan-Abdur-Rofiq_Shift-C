<template>
    <ion-modal :is-open="isOpen" @did-dismiss="cancel">
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ editingId ? 'Edit' : 'Add' }} Recipe</ion-title>
                <ion-buttons slot="start">
                    <ion-button @click="cancel"><ion-icon :icon="close"></ion-icon></ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-item>
                <ion-input
                    v-model="recipe.name"
                    label="Recipe Name"
                    label-placement="floating"
                    placeholder="Enter Recipe Name">
                </ion-input>
            </ion-item>
            <ion-item>
                <ion-textarea
                    v-model="recipe.description"
                    label="Description"
                    label-placement="floating"
                    placeholder="Enter a brief description"
                    :autogrow="true"
                    :rows="3">
                </ion-textarea>
            </ion-item>
            <ion-item>
                <ion-textarea
                    v-model="recipe.steps"
                    label="Steps"
                    label-placement="floating"
                    placeholder="Enter cooking steps"
                    :autogrow="true"
                    :rows="5">
                </ion-textarea>
            </ion-item>
            <ion-row>
                <ion-col>
                    <ion-button type="button" @click="input" shape="round" color="primary" expand="block">
                        {{ editingId ? 'Edit' : 'Add' }} Recipe
                    </ion-button>
                </ion-col>
            </ion-row>
        </ion-content>
    </ion-modal>
</template>

<script setup lang="ts">
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonInput,
    IonRow,
    IonCol,
    IonItem,
    IonContent,
    IonTextarea
} from '@ionic/vue';
import { close } from 'ionicons/icons';

// Define properti untuk menerima data dari komponen induk
const props = defineProps<{
    isOpen: boolean,
    editingId: string | null,
    recipe: {
        name: string;
        description: string;
        steps: string;
    };
}>();

// Emit event ke komponen induk
const emit = defineEmits<{
    'update:isOpen': [value: boolean],
    'update:editingId': [value: string | null],
    'submit': [item: { name: string; description: string; steps: string }]
}>();

// Reset input dan tutup modal
const cancel = () => {
    emit('update:isOpen', false);
    emit('update:editingId', null);
    props.recipe.name = '';
    props.recipe.description = '';
    props.recipe.steps = '';
};

// Emit data yang diinputkan ke komponen induk
const input = () => {
    emit('submit', props.recipe);
    cancel();
};
</script>
