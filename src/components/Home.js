import React from "react";
import {Link} from "react-router-dom";


const Home = () => {


    return (
        <div className="container-home">
            <header className="jumbotron">
            </header>
            <body>
            <div className="container-home">
                <div className="row">
                    <div className="col-sm main-text">
                        <h1>Endless possibilities with cryptocurrency</h1>
                        <span>Create new trading strategies, test them in real time and with past data</span>
                        <div className="mainPage-buttons">
                            <Link to={"/register"}  className="btn btn-primary btn-block btn-gradient" id="mainPage-start-btn">Get started</Link>
                        <a href="#main-learn-more" className="btn btn-primary btn-block btn-gradient-2">Learn more</a>
                        </div>
                    </div>
                    <div className="col-sm main-image-1">
                        <div className="container-main">
                            <img src="../images/Eclipse.png" className="image image1" alt=""/>
                            <img src="../images/Rectangle.png" className="image image3" alt=""/>
                            <img src="../images/main_1.png" className="image image2" alt="" />
                        </div>
                    </div>
                </div>
                <img src="../images/vector.png" className="vector1"/>
                <div className="container" id="main-learn-more">
                <div className="main-description">
                    <h4>How It Works</h4>
                    <h1>Our best service</h1>
                    <span>Trading strategies using candles involve identifying characteristic patterns
                        on the price chart - candle patterns.</span>
                </div>
                <div className="row">
                    <div className="col-sm main-image-2">
                        <img src="../images/vector_2.png" className="image image-second-1"/>
                        <img src="../images/main_2.png" className="image image-second-2"/>
                        <img src="../images/Eclipse2.png" className="image image-second-3"/>
                    </div>
                    <div class="col-sm main-images-text">
                        <div className="main-text1">
                            <span className="main-text-img">
                            <img src="../images/Electric.png"/>
                            </span>
                            <span className="main-text-block">
                            <h6>Trading Candle</h6>
                            A trading candle consists of two main elements: the body of the candle and the shadows.
                                The body of the candle displays the difference between the opening and closing prices
                                of a financial instrument for a given period of time. If the closing price is higher
                                than the opening price, the body of the candle is usually painted white or green.
                            </span>
                        </div>
                        <div className="main-text1">
                            <span className="main-text-img">
                            <img src="../images/Indicators.png" className="indicators"/>
                            </span>
                            <span className="main-text-block">
                            <h6>Indicators</h6>
                           Technical indicators reflect real market indicators and help determine key support/resistance
                                levels, overbought/oversold, trend direction and much more.
                            </span>
                        </div>
                        <div className="main-text1">
                            <span className="main-text-img">
                            <img src="../images/ema.png" className="indicators" />
                            </span>
                            <span className="main-text-block">
                            <h6>EMA</h6>
                            In cryptocurrency trading, investors should find a stable price above the EMA to open a buy position.
                                In addition, a trend trader should understand how to gauge the strength of a trend.
                            </span>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            </body>
        </div>
    );
};

export default Home;
