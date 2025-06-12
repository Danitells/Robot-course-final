import http from 'k6/http';
import { check, sleep } from 'k6';

const team_id = '90131286738'; 
const token = 'pk_138202176_2SJ1325IBAPGOENXMBLLOJDV51O1TGP1'; 
const url = `https://api.clickup.com/api/v2/group?team_id=${team_id}`;

export let options = {
  scenarios: {
//1(Load Test):
    load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '15s', target: 10 }, 
        { duration: '1m', target: 20 },  
        { duration: '30s', target: 0 },
      ],
      exec: 'loadScenario',
    },

    // 2.Stress Test)
    stress_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 },  
        { duration: '1m', target: 20 },   
        { duration: '30s', target: 0 },
      ],
      exec: 'stressScenario',
      startTime: '2m', 
    },
  },
};

export function loadScenario() {
  const res = http.get(url, {
    headers: { 'Authorization': token },
  });

  check(res, {
    'load: статус 200': (r) => r.status === 200,
    'load: время отклика < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1); 
}

export function stressScenario() {
  const res = http.get(url, {
    headers: { 'Authorization': token },
  });

  check(res, {
    'stress: status is 200': (r) => r.status === 200,
    'stress: time response < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(0.5); 
}
