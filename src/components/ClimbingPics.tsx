const imageList = [
    '/climbingImages/climb1.jpg',
    '/climbingImages/climb2.jpg',
    '/climbingImages/climb3.jpg',
    '/climbingImages/climb4.jpg',
    '/climbingImages/climb5.jpg',
    '/climbingImages/climb6.jpg',
    '/climbingImages/climb7.jpg',
    '/climbingImages/climb8.jpg',
    '/climbingImages/climb9.jpg',
    '/climbingImages/climb10.jpg',
];

export default function ClimbingPics() {
    return (
        <div className="infinite-slider-container">
            <div className="infinite-slider-track">
                {imageList.concat(imageList).map((src, id) => (
                    <img src={src} alt={`Climb ${id}`} key={id} />
                ))}
            </div>
        </div>
    )
}