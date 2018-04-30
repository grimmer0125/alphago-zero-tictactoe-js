import 'regenerator-runtime/runtime';
import train, { useDummyDataToTrain } from './main';

const button1 = document.getElementById('testBtn1');
button1.onclick = () => { train(); };

const button2 = document.getElementById('testBtn2');
button2.onclick = () => { useDummyDataToTrain(); };
