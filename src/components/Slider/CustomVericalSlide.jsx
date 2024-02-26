const CustomVerticalSlide = (props) => {

    const img_slider = {
        display: 'block',
        width: "100px",
        height: "100px",
        objectFit: 'cover',
        margin: '0 auto',
        outline: 'none',
      };
    return (
        <div {...props} className="card__slide">
            <div className="card__slide__proc">
                <span>{Math.round(props.evalItem.student_procent)}%</span>
            </div>
            {props.evalItem.img !== null ? (
                <img
                    src={`http://localhost:8000/${process.env.PUBLIC_URL + props?.evalItem.img}`}
                    style={img_slider}
                />
                ) : (
                <img
                src={process.env.PUBLIC_URL + "/images/evaluare.png"}
                    style={img_slider}
                />
                )}
            <div class="overlay_text">
                <div class="text d-flex align-items-end justify-content-between"><span style={{backgroundColor: 'black'}}>Evaluarea № {props.idx}</span></div>
            </div>
        </div>
    )
}
export default CustomVerticalSlide;