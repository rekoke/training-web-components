# Alvaro's solution

## Questions

1. **How would you ensure that the page is fully responsive and developed with mobile-first in mind?**
By using the correct breakpoints and starting the stylesheet with the mobile styles first. Also witht the help of the google chrome toggle device tool. The UI mobile version must have been designed first and adapted to bigger screens.

2. **What sort of optimizations would you suggest for better UI/UX? Are there any tools/metrics that can help to achieve and/or measure these goals?**
First of all you need to be able to navigate your customer to the conversion/desired part of the site with the best experience and ease of usability you can provide. Needs to be natural, intuitive and pleasant to the eyes of the customer so he gets enganged from the first second after landing in yout site. 
To test and measure this, you can use AB testing in production, having 2 different versions of your site up allows you to see wich one converts and works better. 
Also, you can have a pool of users from different demographics to test the usability and give feedback about your site.

3. **How would you make sure that the page works as expected on all supported browsers/devices?**
I would test the page in all the different browsers and versions where my site is expected to work. If my OS doens't allow me to install a browser and I can not ask anyone for a computer with a different OS, I'd use a virtual machine to test it in my own computer.
To test my dev version of the site before going to production in an actual smartphone I'd use proxies and a tool called squidman.

4. **What criteria would you consider for choosing the tech stack for this test case?**
If this was a real case where I would have had to code the list component i'd have used React to create the reusable component, independent from the rest of the code to be able to have all the React lifecycle functions and hooks to manage the state. SCSS/LESS to be able to nest my CSS and to be able to use global variables.
This, being a test case is OK to do it in plain js, for me it has been really nice because I had the chance to learn and practise web components, I never used them before.

## Test
To run the code, install the http server to serve static resource files from a local directory.
```
npm install static-server
```

Run the server.
```
static-server
```

And launch index.html in your favourite browser.

## Comments
- I added a scroll to be able to see all the dates and availabilty. If the availability is less than 5 it turns red as per design.
- The sorting functionality works as expected, giving the tour with no price the last position of the list when sorting by price.
- The filtering functionality works as follows: You click on one of the options in the dropdown and it's going to filter and update the list just with the tours matching the chosen month and the year. I didn't want to use an external library because I wanted to challenge myself, so the development of this functionality is pretty simple and just for this test case.
- I added a placeholder image from unsplash to supply the tours with no image.
- I didn't add the carousel to the tour image because I didn't see the arrows or the carousel in the design, but that could be a good functionality to add to the images if this was a real case.
- I saw the discount in the top corner of the tour item but I couldn't find the logic behind it so I didn't added it. Same with the favourite/heart button on the image.
- Due to the lack of user comments, I added 2 lines of the description where the comment is placed to fill that part with text and make it similar to the design.
- I didn't use any framework or external libraries to achieve the desired results.