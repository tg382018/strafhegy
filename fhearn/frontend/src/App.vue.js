import { defineComponent, ref, onMounted } from "vue";
import FHEarn from "./components/FHEarn.vue";
import Landing from "./components/Landing.vue";
export default defineComponent({
    name: "App",
    components: {
        FHEarn,
        Landing,
    },
    setup() {
        const showApp = ref(false);
        onMounted(() => {
            const persisted = localStorage.getItem("fhearn_show_app");
            if (persisted === "1")
                showApp.value = true;
        });
        return { showApp };
    },
});
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    FHEarn,
    Landing,
};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app" },
});
if (!__VLS_ctx.showApp) {
    const __VLS_0 = {}.Landing;
    /** @type {[typeof __VLS_components.Landing, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onLaunchApp': {} },
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onLaunchApp': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onLaunchApp: (...[$event]) => {
            if (!(!__VLS_ctx.showApp))
                return;
            __VLS_ctx.showApp = true;
        }
    };
    var __VLS_3;
}
else {
    const __VLS_8 = {}.FHEarn;
    /** @type {[typeof __VLS_components.FHEarn, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
    const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
}
/** @type {__VLS_StyleScopedClasses['app']} */ ;
var __VLS_dollars;
let __VLS_self;
//# sourceMappingURL=App.vue.js.map