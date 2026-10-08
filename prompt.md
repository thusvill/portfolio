i need a fully functioning portfolio website.
it should have terminal vibe, like mono fonts and blinking cursors, etc...
no gradient colors, use pastal color palettes(only two colors like black/white etc...)
the code should be modular{
every project is a project class/struct/object.
class project{
name
time_duration(like since 2011)
isOngoing
description
download_link/github_link (should auto detect and change button icon based on the link type)
age_when_this_project_was_made(optional)
etc...
};
each project search images from src/img/PROJECT_NAME/thumbnail/,src/img/PROJECT_NAME/appicon/ , src/img/PROJECT_NAME/screenshots, etc...

}
projects should be displayed in a grid layout with hover effects that show more details about the project. The website should also have a terminal-like interface where users can type commands to navigate through the portfolio, such as "list projects", "view project [name]", etc.
also when click on each grid item, it should open a fullscreen popup/modal that displays detailed information about the project, including images, description, and links. The modal should have a close button and support keyboard navigation (e.g., arrow keys to navigate between projects).

each Qualification or skill should also be represented as a class/struct/object, similar to the project class. The website should have a section for skills and qualifications, displayed in a list or grid format, with hover effects that show more details about each skill.
The website should be responsive and work well on both desktop and mobile devices. It should also havea dark mode toggle, allowing users to switch between light and dark themes. The terminal interface should alsosupport dark mode, with appropriate color changes for text and background.

the mouse cursor should be a crosshair with smooth animations, and the website should have a subtle background animation that gives it a dynamic feel without being distracting. The overall design should be clean and minimalistic, focusing on usability and readability.
user C like synthacs but keep it basic so everone can understand.

use any API that support for vercel's free plan and keep all optmized and simple.

use a placeholder image for my image and store it under src/img/profile.png and favicon.png
