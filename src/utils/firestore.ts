import { auth, db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';

// Interface data
export interface Recipe {
    id?: string;
    name: string;
    steps: string[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Operasi CRUD
export const firestoreService = {
    // Get collection reference
    getRecipeRef() {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('User not authenticated');
        return collection(db, 'users', uid, 'recipes');
    },

    // Create
    async addRecipe(recipe: Omit<Recipe, 'id'>) {
        try {
            const recipeRef = this.getRecipeRef();
            const docRef = await addDoc(recipeRef, {
                ...recipe,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error Adding Recipe:', error);
            throw error;
        }
    },

    // Read
    async getRecipes(): Promise<Recipe[]> {
        try {
            const recipeRef = this.getRecipeRef();
            const q = query(recipeRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as Recipe));
        } catch (error) {
            console.error('Error Getting Recipes:', error);
            throw error;
        }
    },

    // Update
    async updateRecipe(id: string, recipe: Partial<Recipe>) {
        try {
            const recipeRef = this.getRecipeRef();
            const docRef = doc(recipeRef, id);
            await updateDoc(docRef, {
                ...recipe,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error Updating Recipe:', error);
            throw error;
        }
    },

    // Delete
    async deleteRecipe(id: string) {
        try {
            const recipeRef = this.getRecipeRef();
            const docRef = doc(recipeRef, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error Deleting Recipe:', error);
            throw error;
        }
    }
};
