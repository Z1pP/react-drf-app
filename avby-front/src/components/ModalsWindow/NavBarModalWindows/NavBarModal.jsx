export default function NavBarModal({children, showModal}) {

    if (!showModal) {
        return null;
    }

    console.log(children)
    
    return (
        <div className="modal__wrapper">
            <div className="modal__overlay">
                {children}
            </div>
        </div>
        
    )
}