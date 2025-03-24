const modalOpenButtons = [...document.getElementsByClassName('modal-open-button')]

modalOpenButtons.forEach((modalOpenButton) => {
    modalOpenButton.addEventListener('click', () => {
        /* `const targetModalId = modalOpenButton.dataset.modalTarget` is retrieving the value of the
        `data-modal-target` attribute from the `modalOpenButton` element. This value is typically
        used to identify the specific modal that should be opened when the button is clicked. */
        const targetModalId = modalOpenButton.dataset.modalTarget

        const modal = document.getElementById(targetModalId)

        const modalCloseButtons = [...document.querySelectorAll('[data-modal-role="close"]')]
        const modalCancelButtons = [...document.querySelectorAll('[data-modal-role="cancel"]')]
        const modalActionButtons = [...document.querySelectorAll('[data-modal-role="action"]')]

        modal.classList.remove('hidden')

        modalCloseButtons.forEach(closeButton => {
            closeButton.onclick = () => { modal.classList.add("hidden") }
        })

        modalCancelButtons.forEach(cancelButton => {
            cancelButton.onclick = () => { modal.classList.add("hidden") }
        })


        modalActionButtons.forEach(actionButton => {
            // actionButton.onclick = () => { modal.classList.add("hidden") }
        })


    })
})   