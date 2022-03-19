import {parse} from 'csv-parse';
import fs from 'fs';
import {promisify} from 'util';

// 讀資料
const raw = await fs.promises.readFile('/dev/stdin');
const data = await promisify(parse)(raw, {
	skip_empty_lines: true,
}).then(data => data.map(i => parseFloat(i[0])));

let E = [];  // e
let R = [];  // 殘差
let upper = 20000;  // 上限
let interval = 1;  // 小數點位數
let w = 1;  // 計算最大 e 時 local maximum 要多算多寬

// 向下取 e 整
function f(e, x){
	return e * Math.floor(x / e);
}

// 計算殘差和
for(let e = 0; e <= upper; e+=interval) {
	let r = 0;
	for(let j of data){
		let u = f(e, j);
		r += Math.min(j-u, u+e-j);
	}
	R.push(r)
	E.push(e)
}

// console.log("e\tR")
// for(let i = 0; i < E.length; i+=100) {
//     console.log(`${E[i]}\t${R[i]}`)
// }


// 計算是否是 local minimum
function bottom(R, i, n){
	let flag = true;
	for(let j = i-n; j < i && flag; j++){
		if(R[j] <= R[j+1]) flag = false;
	}
	for(let j = i; j < i+n && flag; j++){
		if(R[j] >= R[j+1]) flag = false;
	}

	return flag;
}

// 尋找使殘差最小的（local maximum）最大的 e
console.log("w, e, R");
for(let w = 1; w < 10; w++){
	for(let i = R.length-2; i >= 0; i--) {
		if(bottom(R, i, w)){
			console.log(`${w}, ${E[i]}, ${R[i]}`)
			break;
		}
	}
}
