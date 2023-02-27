const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://theyetee.com/";

async function getShirts() {
    let leftImg;
    let rightImg;

    await axios.get(url)
        .then(res => {
            //html parsing!!
            const $ = cheerio.load(res.data);
            //drill down to the div containing shirt images for the left and right timed shirts of the day
            let leftShirt = $('.module_timed-item.is--full.is--left > .module_timed-item--images')
            let rightShirt = $('.module_timed-item.is--full.is--right > .module_timed-item--images')
            //find first image for each shirt
            leftImg = `https:${leftShirt.find('.swiper-slide > a').attr('href')}`;
            rightImg = `https:${rightShirt.find('.swiper-slide > a').attr('href')}`;
        })
        .catch(function (error) {
            console.log('Error', error.message);
            return null;
        });
    return [leftImg, rightImg]
}

module.exports = {getShirts};