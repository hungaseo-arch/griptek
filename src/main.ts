import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);
app.use(router);

// 라우터가 초기 라우트를 해석(afterEach 로 <head> 설정 완료)한 뒤 마운트.
// Prerendering(@prerenderer): 렌더 완료 신호.
// 빌드 시 헤드리스 브라우저가 이 이벤트를 기다렸다가 완성된 HTML을 캡처한다.
router.isReady().then(() => {
  app.mount('#app');
  document.dispatchEvent(new Event('render-event'));
});
