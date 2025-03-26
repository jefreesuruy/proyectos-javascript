const createCalendar = ({year,locale}) =>{

    // array de 7 para los dias de la semana
    const weekDays = [...Array(7).keys()]
    const intlWeekDay = new Intl.DateTimeFormat(locale,{weekday:"short"})//short para mostar los nombres cortos lunes = lun

    // funcionamiento boton
    document.getElementById('down').addEventListener('click',()=>{
        const el = document.querySelector('div')
        el.scrollTo({top: el.scrollTop + window.innerHeight, behavior: 'smooth'})
    })

    document.getElementById('up').addEventListener('click',()=>{
        const el = document.querySelector('div')
        el.scrollTo({top: el.scrollTop - window.innerHeight, behavior: 'smooth'})
    })

    const weekDaysNames = weekDays.map(weekDaysIndex =>{
        const weekDaysNames = intlWeekDay.format(new Date(2025,8,weekDaysIndex + 1))
        return weekDaysNames
    })

    // array de 12 posiciones para los meses
    const months = [...Array(12).keys()]
    const intl = new Intl.DateTimeFormat(locale,{month:"long"})

    // recuperar datos
    const calendar = months.map(monthkey =>{
    
    // recuperar los meses del año
    const monthName = intl.format(new Date(year,monthkey))
    
    // recuperar la cantidad de dias por mes - ultimo dia del mes anterior
    const nextMonthIndex = monthkey + 1
    const daysOfMonth = new Date(year, nextMonthIndex, 0).getDate()

    //recuperar el dia de inicio del mes
    const startsOn = new Date(year, monthkey, 1).getDay()

    return {
        monthName,
        daysOfMonth,
        startsOn
        }
    })
    
    // mapear lo recuperado en html 
    const html = calendar.map(({daysOfMonth, monthName,startsOn})=>{

    const days = [...Array(daysOfMonth).keys()]

    const firstDayAttributes = `class='first-day' style='--first-day-start: ${startsOn}'`

    const renderDays = days.map((day,index) => `<li ${index === 0 ? firstDayAttributes: ""}>${day + 1}</li>`).join("")

    const renderWeekDays = weekDaysNames.map(weekDaysName =>`<li class="day-name">${weekDaysName}</li>`).join("")

    const monthshAndYear = `<h1>${monthName} ${year}</h1>`
    const daysPerMonth = `<ol>${renderWeekDays}${renderDays}</ol>`

    return `<div class='month'>${monthshAndYear}${daysPerMonth}</div>`
    }).join("")

    document.querySelector("div").innerHTML = html
}

createCalendar({year: 2025, locale:"ES"})