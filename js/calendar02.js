const Day = document.querySelector('.day'); // 달력 ul
const month = document.querySelector('.month-name'); // 년도 - 월 title
const date = new Date();

const pre = document.querySelector('.left'); //이전 달
const next = document.querySelector('.right'); // 다음 달 

// 달력에 현재 날짜를 표기하기 위한 용도 
let currentMon = date.getMonth()+1;  // 0부터 시작함으로 +1 
let currentYear = date.getFullYear();
let currentDay = date.getDate();

// 마우스로 클릭한 날짜를 표시하기 위한 용도
let DayOfChoice = currentDay;
let MonOfChoice = currentMon;
let yearOfChoice = currentYear;

//================================ 캘린더 ==================================================================//
//1. 윤년 조건 설정
function isLeapYear(year){ //윤년조건: 4와 400으로 나누어 떨어지거나, 100으로 나누어 떨어지지 않는 년도
    if((year%4==0)&&(year%400==0||year%100!=0)){
        return true;
    } else {
        return false;
    }
}

//2. month 말일 값 반환
function getDayOfMon(year,mon){
    if(mon===1||mon===3||mon===5||mon===7||mon===8||mon===10||mon===12){
        return 31;
    } else if(mon===2){
        return isLeapYear(year)? 29 : 28;
    } else{
        return 30;
    }
}

//3. 날짜의 요일 값 
// * 0 일요일 1 월요일 2 화요일 ..... 6 토요일
function getDay(year,mon,day){
    const conYMD = year+ ' ' + mon + ' ' +day
    return(new Date(conYMD).getDay());  //* Date.prototype.getDay() : 주어진 날짜의 현지 시간 기준 요일을 반환 (0은 일요일)
}

//4. 달력 생성 
function makeCalendar(year,mon,dayCount){
    Day.innerHTML=''; //초기화
    let getFirstDay = getDay(year,mon,1); //1일의 요일 값

    // 4-1. 1일 앞에 있는 날짜
    for(let i=getFirstDay; i>0; i--){
        const listPre = document.createElement('li');
        listPre.style.opacity = '0';
        listPre.classList.add('disabled');
        Day.appendChild(listPre);
    }
   
    // 4-2. 나머지 날짜 (1일 ~ 말일)
    for(let i=1; i<=dayCount; i++){ 
        const list = document.createElement('li');
        list.textContent = `${i}`;

        if(i===currentDay && yearOfChoice===currentYear && MonOfChoice===currentMon){ //오늘 날짜 표시
            list.style.border = '3px solid red';
        }

        if(0===getDay(currentYear,currentMon,i)){ //일요일
            list.style.color = 'red';
        }else if(6==getDay(currentYear,currentMon,i)){ //토요일
            list.style.color = 'blue';
        }

        Day.appendChild(list);
    }
}

//5. 년도 - 달 
function setMonthTitle(year,mon){
    month.textContent = `${year}.${mon}`
}

//6. 다음 달 이동 
function nextMonthOrYear(){
    if(currentMon===12){
        currentYear = currentYear+1;
        currentMon = 1;
    }else{
        currentMon = currentMon+1;
    }
    setMonthTitle(currentYear,currentMon);
    makeCalendar(currentYear,currentMon,getDayOfMon(currentYear,currentMon));
}
next.addEventListener('click',nextMonthOrYear);

//7. 이전 달 이동
function preMonthOrYear(){
    if(currentMon===1){
        currentYear = currentYear-1;
        currentMon = 12;
    }else{
        currentMon = currentMon-1;
    }
    setMonthTitle(currentYear,currentMon);
    makeCalendar(currentYear,currentMon,getDayOfMon(currentYear,currentMon));
}
pre.addEventListener('click',preMonthOrYear);


//8. 최종 실행
function main(){
    setMonthTitle(currentYear,currentMon);
    makeCalendar(currentYear,currentMon,getDayOfMon(currentYear,currentMon));
    todoTitle.textContent = `What are you going to do on ${currentYear}.${currentMon}.${currentDay} 👀⁉`;
    displayToDoOnDays();
}

//================================ todolist ==================================================================//
const todoField = document.querySelector('.todo'); // todolist 전체 영역
const todoTitle = document.querySelector('.todo-title'); // todolist title
const todoList = document.querySelector('.todoList'); // list 감싸고 있는 ul 
const input = document.querySelector('input[type="text"]');
const add = document.querySelector('.add');

let clickEventArr = []; // 클릭되는 날짜 담는 배열
let storeToDo = []; //localstorage에 저장되는 key값 담는 배열

// 9. border style 초기화
function clearEvent(){ 
    clickEventArr.forEach((value)=>{
        value.style.border = 'none';
    });
}

// 10. day click 이벤트
Day.addEventListener('click',(event)=>{
    if(event.target.tagName ==='UL'){ //ul영역 클릭, 실행 중단
        return;
    } 
    if(event.target.className!=='disabled'){ //활성화된 영역(li) ,클릭 했을 때 
        clickEventArr.push(event.target);
        console.log(clickEventArr);

        clearEvent(); // border style 초기화
        event.target.style.border='3px solid black';

        todoTitle.textContent = `What are you going to do on ${currentYear}.${currentMon}.${event.target.textContent} 👀⁉`;
        DayOfChoice = event.target.textContent; // 변수 재할당
        input.focus();

        displayToDoOnDays();
    }
});

// 11. 입력한 key값 localstorage에 저장
function addToDoList(){
    if(input.value === ''){
        alert('please input you are going to do');
        return;
    }

    storeToDo = keepStore(); //변수 재할당
    storeToDo.push(input.value);
    
    const YMD = currentYear+'-'+currentMon+'-'+DayOfChoice;
    localStorage.setItem(YMD,storeToDo); // * setItem(key, value) : 키-값 쌍을 보관함
    
    displayToDoOnDays();
    input.value="";
    input.focus();
}

add.addEventListener('click',(event)=>{
    addToDoList();
});

input.addEventListener('keypress',(event)=>{
    if(event.key==='Enter'){
       addToDoList();
    }
}); // -----------> 여기까지하면 localstorage에 입력한 key값은 저장되지만, 화면에 list가 출력되지 않음


// 12. 날짜 별, localstorage에 key값 저장
function keepStore(){
    const YMD = currentYear+'-'+currentMon+'-'+DayOfChoice;
    let arrayToDo;
    let arr = [];
    if(!localStorage.getItem(YMD)){ //localstorage에 key값이 없을 때
        return arr; // 빈 배열 반환
    }
    if(localStorage.getItem(YMD).includes(',')){ //key 값이 2개 이상 일 때
        arrayToDo = localStorage.getItem(YMD).split(',');
        arrayToDo.forEach((value)=>{
            arr.push(value);
        });
    } else{
        arr.push(localStorage.getItem(YMD));
    }
    return arr; //최종적으로 key값(YMD)들의 배열을 반환

} //-----------> key값이 누적되는 것을 방지,  선택한 날짜별로 입력한 key값 배열을 만들어줌


// 13. 날짜 별, localstorage에 저장된 key값들을 todolist로 출력 
function displayToDoOnDays(){
    todoList.innerHTML=''; //초기화
    const YMD = currentYear+'-'+currentMon+'-'+DayOfChoice; 
    const li = document.createElement('li');
    const deleteBtn = document.createElement('button');
    let arrayToDo;

    if(!localStorage.getItem(YMD)){ //localstorage key 값이 없을 때
        //* getItem(key) : key 값을 받아옴 - 데이터 읽기
        return; //함수 실행 종료
    }
    
    if(localStorage.getItem(YMD).includes(',')){ //key값이 2개 이상일 때
        //* includes() 배열 내에 특정 요소가 포함되어 있는지 확인하여 true, false값을 반환
        arrayToDo = localStorage.getItem(YMD).split(','); 
        // * split() 객체를 지정한 구분자를 이용하여 여러 개의 문자열로 나눔 
        // * localstorage에 저장되는 모든 데이터는 string(문자열)로 저장됨
        arrayToDo.forEach((value)=>{ //* forEach() 주어진 함수를 배열 요소 각각에 대해 실행
            const li = document.createElement('li');
            const deleteBtn = document.createElement('button');

            deleteBtn.setAttribute('class','deleteBtn');
            deleteBtn.innerHTML = '<i class="far fa-minus-square"></i>';
            li.innerText = value;
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
        
    } else{ 
        deleteBtn.setAttribute('class','deleteBtn');
        deleteBtn.innerHTML = '<i class="far fa-minus-square"></i>';
        li.textContent = localStorage.getItem(YMD);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }
}

// 14. key값 삭제 (todolist 삭제)
todoList.addEventListener('click',(event)=>{
    if(event.target.className==='far fa-minus-square'){
        console.log(event.target.parentNode.parentNode.textContent);

        todoList.removeChild(event.target.parentNode.parentNode);
        //-----------> 화면에서만 list 삭제, localstorage에는 남아있음
             
        const YMD = currentYear+'-'+currentMon+'-'+DayOfChoice;
        if(localStorage.getItem(YMD).includes(',')){ //2개 이상 
            let array = localStorage.getItem(YMD).split(',');
            let copyArray = [];
            array.forEach((value)=>{
                if(value !== event.target.parentNode.parentNode.textContent){// 1. 남아있는 list와 선택한(삭제) list가 다를 때, 
                    copyArray.push(value); // 2. copyArry에 남아 있는 list를 넣어준다. 
                }
            });
            localStorage.setItem(YMD,copyArray); //3. 삭제한 list가 제외된 copyArray를 localstorage에 다시 저장한다. 
        }else{ // 1개
            localStorage.removeItem(YMD); //키값 식제
        }
    }
}); 

main();