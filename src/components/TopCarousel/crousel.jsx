import Carousel from "react-bootstrap/Carousel";
// import ExampleCarouselImage from 'components/ExampleCarouselImage';

function TopCarousel() {
  return (
    <Carousel>
      <Carousel.Item>
        {/* <ExampleCarouselImage text="First own-slide" /> */}
        <img
          src="https://i.pinimg.com/originals/98/7e/f1/987ef146ca14c2622144836ee12450a5.jpg"
          alt=""
        />
        <Carousel.Caption>
          <h3>First own-slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="https://images6.alphacoders.com/130/1308158.jpeg"
          alt=""
        />
        {/* <ExampleCarouselImage text="Second own-slide" /> */}
        <Carousel.Caption>
          <h3>Second own-slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        {/* <ExampleCarouselImage text="Third own-slide" /> */}
        <img
          src="https://www.kaumimarg.com/images/news/full47639.jpg"
          alt=""
        />
        <Carousel.Caption>
          <h3>Third own-slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default TopCarousel;
