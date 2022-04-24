import { createWebHistory, createRouter } from "vue-router"
import DefaultLayout from "@/layouts/DefaultLayout.vue"
import SearchPage from "@/views/SearchPage.vue"

const routes = [
    {
        path: '/',
        name: 'DefaultLayout',
        component: DefaultLayout,
        children: [
            {
                path: "/",
                name: "SearchPage",
                component: SearchPage,
            },
        ]}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router