const DECISION_THRESHOLD = 95

let isAnimating = false
let pullDeltaX = 0 //distancia que la card se esta arrastrando

function starDrag(event){
    if(isAnimating) return

    // recuperar el primer elemento de las cards
    const actualCard = event.target.closest('article')
    if(!actualCard) return

    // recuperar la posicion inicial
    const startX = event.pageX ?? event.touches[0].pageX

    // escuchar cuando se esta moviendo
    document.addEventListener('mousemove', onMove) // cuando se mueve
    document.addEventListener('mouseup', onEnd) // cuando termina

    document.addEventListener('touchmove', onMove, {passive:true})
    document.addEventListener('touchend', onEnd, {passive:true})

    // cuando se mueve
    function onMove(event){
        
        // posicion actual
        const currentX = event.pageX ?? event.touches[0].pageX
        
        // La distancia entre la inicial y la posicion actual
        pullDeltaX = currentX - startX
        
        // si no se ah recorrido alguna distancia no hacer nada
        if(pullDeltaX === 0) return

        // cambiar la bandera indicando que la card  esta animandose
        isAnimating = true
        
        // los grados que tendra la card al trasladarse
        const deg = pullDeltaX / 14

        // transformacion de la card
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`

        // cambiar el cursor
        actualCard.style.cursor = 'grabbing'
    }

    // cuando termina
    function onEnd(event){

        // limpiar los event listeners
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)

        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('touchend', onEnd)

        // saber si el usuario tomo una decision
        const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

        if(decisionMade){
            const goRight = pullDeltaX >= 0

            // añadir clase segun la decision del usuario
            actualCard.classList.add(goRight ? 'go-right' : 'go-left')
            actualCard.addEventListener('transitionend', () => {
            actualCard.remove()
            })

        }else{
            actualCard.classList.add('reset')
            actualCard.classList.remove('go-right','go-left')
        }
        
        // resetear las variables
        actualCard.addEventListener('transitionend', () => {
            actualCard.removeAttribute('style')
            actualCard.classList.remove('reset')
        
            pullDeltaX = 0
            isAnimating = false
        })
    }
}

document.addEventListener('mousedown', starDrag)
document.addEventListener('touchstart', starDrag, {passive: true})