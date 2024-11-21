document.getElementById('fetch-data').addEventListener('click', async () => {
    const accessToken = document.getElementById('accessToken').value;
    const cookie = document.getElementById('cookie').value;
    const linkList = document.getElementById('linkList').value.trim().split('\n').map(link => link.trim());

    if (!accessToken || !cookie || linkList.length === 0) {
        alert("Please fill in all fields and enter at least one link.");
        return;
    }

    // Clear previous results
    document.getElementById('post-list').innerHTML = "";

    for (const url of linkList) {
        try {
            // Make the API call to get the redirected URL and ID
            const redirectResponse = await fetch('http://localhost:3000/get-redirect-id-from-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            const redirectData = await redirectResponse.json();
            const id_story_fbid = redirectData.id_story_fbid;
            console.log('ID:', id_story_fbid);

            // After getting the ID, fetch Facebook data
            const facebookDataResponse = await fetch('http://localhost:3000/get-facebook-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    cookie: cookie,
                    idPost: id_story_fbid
                })
            });

            const facebookData = await facebookDataResponse.json();
            console.log(facebookData);

            // Display the results
            const postList = document.getElementById('post-list');
            const postItem = document.createElement('li');
            postItem.classList.add('post-item');

            postItem.innerHTML = `
                <div class="post-details">
                    <p><strong>Reactions:</strong> ${facebookData.reactions_count || 0}</p>
                    <p><strong>Shares:</strong> ${facebookData.shares_count || 0}</p>
                    <p><strong>Comments:</strong> ${facebookData.comments_count || 0}</p>
                    <p><strong>Picture:</strong> <img src="${facebookData.picture}" alt="Post Picture" style="width: 100px; height: 100px;"></p>
                </div>
            `;

            postList.appendChild(postItem);

        } catch (error) {
            console.error('Error:', error);
        }
    }
});
