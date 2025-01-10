export function DocsContent() {
  return (
    <div className="docs-content">
      <section>
        <h2 id="about">About</h2>
        <p>
          Test Tile Tracker is an online platform designed by potters, for potters, to help document and organise their work systematically. 
          With Test Tile Tracker, you can build a comprehensive digital library of your clay bodies, decorations, and test tiles that's accessible anywhere, anytime.
        </p>
        <p>Test Tile Tracker is built and maintained by Rihana Ries.</p>
        
        <p>Test Tile Tracker helps you:</p>
        <ul>
          <li>Keep a record of the clay bodies you regularly use in your practice</li>
          <li>Document the details of decorations like glazes, slips, oxides and more, whether they're commercial, from a community studio, or your own recipe</li>
          <li>Build a searchable library of linked test tiles with detailed notes and images</li>
          <li>Organise related test tiles into collections for easy reference</li>
        </ul>

        <h3 id="changelog">Changelog</h3>
        <p>Latest update: 6 January 2025</p>
        <ul>
          <li>Table image thumbnail bug fixed</li>
          <li>Favicon bug fixed</li>
        </ul>

        <h3 id="roadmap-and-suggestions">Roadmap and suggestions</h3>
        <p>
          Test Tile Tracker is always being improved. Our development roadmap is shaped by user feedback, 
          so if you have an idea that you would like to share, please send it through to hello@testtiletracker.com.
        </p>
        <p>Coming soon:</p>
        <ul>
          <li>Video documentation</li>
          <li>Public profiles and shareable library items</li>
          <li>Export library functionality</li>
          <li>Test tile duplication function</li>
          <li>Bulk actions</li>
        </ul>

        <h3 id="report-a-bug">Report a bug</h3>
        <p>
          Test Tile Tracker not working as expected? Drop a line to hello@testtiletracker.com with an explanation 
          of the bug you're encountering.
        </p>

        <h3 id="guidelines">Guidelines</h3>
        <p>
          Test Tile Tracker works best when users follow consistent documentation practices. These guidelines have been 
          developed to help you get the most out of your library and the app's capabilities.
        </p>
      </section>

      <section>
        <h2 id="guide">Using Test Tile Tracker</h2>
        
        <h3 id="getting-started">Getting started</h3>
        
        <h4 id="how-ttt-works">How TTT works</h4>
        <p>Test Tile Tracker organises your work through four interconnected components:</p>
        <ol>
          <li>Clay bodies: Create entries for each clay type you use</li>
          <li>Decorations: Document glazes, slips, oxides, and other surface treatments</li>
          <li>Test tiles: Record experiments that combine clay bodies with decorations</li>
          <li>Collections: Group related test tiles for easy reference</li>
        </ol>
        <p>
          Linking these components together allows you to quickly filter your test tiles by clay body, decoration, 
          firing temperature, atmosphere, or multiple attributes. As your library grows, you'll be able to track 
          patterns and results across different combinations.
        </p>

        <h4 id="creating-an-account">Creating an account</h4>
        <ol>
          <li>Visit the registration page</li>
          <li>Enter your email address</li>
          <li>Choose a username (minimum 3 characters)</li>
          <li>Create a password that includes:
            <ul>
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
            </ul>
          </li>
          <li>Confirm your password</li>
          <li>Click 'Sign up'. You'll then be taken to the login page, where you can enter your email and password to log in.</li>
        </ol>

        <h4 id="navigation">Navigation</h4>
        <p>
          Once you log in, you'll be taken to your dashboard, which shows you a summary of all your library items and a list of your latest test tiles.
        </p>
        <p>At the top of the screen is the main navigation menu, which contains the following:</p>
        <ol>
          <li>The Test Tile Tracker logo (top left). Clicking on this will take you back to your dashboard from anywhere in the app.</li>
          <li>Test Tiles. This is your library of test tiles and where you can add new test tiles.</li>
          <li>Collections. This is where you can organise your test tiles into collections.</li>
          <li>Clay Bodies. This is your library of clay bodies and where you can add new clay bodies.</li>
          <li>Decorations. This is your library of decorations and where you can add new decorations.</li>
          <li>Profile menu (top right). You can sign out here, or edit your personal profile.</li>
        </ol>

        <h4 id="getting-help">Getting help</h4>
        <p>
          If you're having trouble with any aspect of Test Tile Tracker, email hello@testtiletracker.com. 
          You can also reach out on Instagram: @test.tile.tracker
        </p>

        <h4 id="editing-your-profile">Editing your profile</h4>
        <p>
          Your user profile can be found by clicking on the profile menu (top right) and selecting 'Profile Settings'. 
          Here you can update your details, upload a profile picture, change your password or delete your account.
        </p>

        <h3 id="the-test-tile-tracker-process">The Test Tile Tracker process</h3>
        
        <h4 id="basic">Basic</h4>
        <ol>
          <li>First, create clay body entries:
            <ul>
              <li>Add basic details (name, type)</li>
              <li>Specify firing requirements</li>
              <li>Include technical specifications if available</li>
              <li>Upload optional reference images</li>
            </ul>
          </li>
          <li>Document your decorations:
            <ul>
              <li>Add basic details (name, type)</li>
              <li>Specify firing requirements</li>
              <li>Include technical specifications if available</li>
              <li>Record visual characteristics</li>
              <li>Upload optional reference images</li>
            </ul>
          </li>
          <li>Create test tiles:
            <ul>
              <li>Select the clay body used</li>
              <li>Add decoration layers in order</li>
              <li>Specify firing details</li>
              <li>Upload result images</li>
            </ul>
          </li>
          <li>Organise into collections:
            <ul>
              <li>Group related experiments</li>
              <li>Add descriptive notes</li>
              <li>Create themed sets</li>
            </ul>
          </li>
        </ol>

        <h4 id="advanced">Advanced</h4>
        <p>
          All of the steps in the basic process can be done from the 'Add test tile' page.
        </p>
        <p>
          When selecting a clay body, there is an option to 'Add new clay body'. This will open a window where you can add a new clay body. 
          Clicking 'Create new clay body' will close the window, save the clay body to your library, and then select it for your test tile.
        </p>
        <p>
          When adding decoration layers, there is an option to 'Add new decoration'. This will open a window where you can add a new decoration. 
          Clicking 'Create new decoration' will close the window, save the clay body to your library, and then add it to the current active decoration layer.
        </p>
        <p>
          Lastly, you can add your new test tile to any existing collection or collections available in your library.
        </p>

        <h3 id="clay-bodies-your-foundation-library">Clay bodies: your foundation library</h3>
        <p>
          Clay bodies are the foundation of your ceramic work, and in Test Tile Tracker, they're the starting point for documenting your experiments. 
          Every test tile you create will be linked to a clay body, allowing you to track how different clays perform with various decorations and firing conditions.
        </p>

        <p>Creating a clay body entry:</p>
        <ol>
          <li>From the Clay Body page, click on the 'Add new clay body' button in the top right</li>
          <li>Enter required information:
            <ul>
              <li>Name</li>
              <li>Type (stoneware, porcelain, etc.)</li>
            </ul>
          </li>
          <li>Add optional details:
            <ul>
              <li>Manufacturer</li>
              <li>Cone range</li>
              <li>Firing temperatures</li>
              <li>Physical properties</li>
              <li>Colour characteristics</li>
              <li>Technical measurements</li>
              <li>Notes and images</li>
            </ul>
          </li>
        </ol>

        <p>
          Once you have created a clay body and begin using it in test tiles, any tile using it will appear in the clay body entry.
        </p>

        <h3 id="decorations-building-your-surface-treatment-library">Decorations: building your surface treatment library</h3>
        <p>
          Decorations in Test Tile Tracker can be anything you apply to your clay – from commercial glazes to hand-mixed slips. 
          When you create test tiles, you'll be able to select from your decoration library and layer them in specific orders. 
          This structured approach helps you track which combinations work best and under what conditions.
        </p>

        <p>Recording a decoration:</p>
        <ol>
          <li>From the Decoration page, click on the 'Add new decoration' button in the top right</li>
          <li>Add required information:
            <ul>
              <li>Name</li>
              <li>Type (glaze, underglaze, slip, etc.)</li>
            </ul>
          </li>
          <li>Specify details:
            <ul>
              <li>Source (commercial, studio, etc.)</li>
              <li>Manufacturer (if applicable)</li>
              <li>Cone range</li>
              <li>Firing atmosphere options</li>
              <li>Colour and surface characteristics</li>
              <li>Recipe or Glazy link (if applicable)</li>
              <li>Notes and images</li>
            </ul>
          </li>
        </ol>

        <p>
          Once you have created a decoration and begin using it in test tiles, any tile using it will appear in the decoration entry.
        </p>

        <h3 id="test-tiles-bringing-it-all-together">Test tiles: bringing it all together</h3>
        <p>
          Test tiles are where your library comes to life. Each test tile combines a clay body from your clay library with one or more 
          decorations from your decoration library. This interconnected approach means you can easily track how specific decorations 
          perform on different clay bodies, or how a particular clay body accepts various decorations.
        </p>

        <p>Creating a test tile record:</p>
        <ol>
          <li>From the Test Tiles page, click on the 'Add new test tile' button in the top right</li>
          <li>Enter basic information:
            <ul>
              <li>Name</li>
              <li>Stamp identifier (optional)</li>
              <li>Clay body</li>
              <li>Cone</li>
              <li>Atmosphere</li>
            </ul>
          </li>
          <li>Add decoration layers:
            <ul>
              <li>Select a decoration or decorations from the 'Layer 1' dropdown menu</li>
              <li>If layering decorations, click 'Add layer' and repeat the decoration selection process</li>
            </ul>
          </li>
          <li>Complete the record:
            <ul>
              <li>Add to collections (optional)</li>
              <li>Include notes</li>
              <li>Upload images</li>
            </ul>
          </li>
        </ol>

        <p>Understanding test tile relationships:</p>
        <ul>
          <li>Each test tile is linked to one clay body</li>
          <li>Test tiles can include multiple decoration layers</li>
          <li>Decoration layers allow you to see what order you applied the decorations in</li>
          <li>All firing conditions are recorded</li>
          <li>Results can be filtered by clay body, decoration, cone, atmosphere</li>
        </ul>

        <h3 id="collections-organising-your-experiments">Collections: organising your experiments</h3>
        <p>
          Collections help you group related test tiles in ways that make sense for your work. You might create collections based on 
          clay body, decoration type, firing conditions, or project goals. Because test tiles maintain their links to clay bodies and 
          decorations, you can easily see patterns within collections.
        </p>

        <p>Managing collections:</p>
        <ol>
          <li>From the Collections page, click on the 'Add new collection' button in the top right
            <ul>
              <li>Name your collection</li>
              <li>Add a description</li>
            </ul>
          </li>
          <li>Add test tiles:
            <ul>
              <li>Select tiles to include</li>
            </ul>
          </li>
          <li>Organise and maintain:
            <ul>
              <li>Add or remove tiles</li>
              <li>Update descriptions</li>
              <li>View all related tests</li>
            </ul>
          </li>
        </ol>

        <h2 id="getting-the-most-out-of-your-library">Getting the most out of your library: Working with relationships</h2>
        <p>
          As your library grows, the relationships between clay bodies, decorations, and test tiles become increasingly valuable. 
          Test Tile Tracker's filtering and search capabilities help you explore these connections.
        </p>

        <h3 id="sort-filter-and-search">Sort, filter and search</h3>
        <p>The interconnected nature of your library allows for powerful filtering:</p>
        <ul>
          <li>Find all test tiles using a specific clay body</li>
          <li>See how decorations change based on the clay body they're paired with</li>
          <li>Compare results across different firing conditions</li>
          <li>Track successful combinations through related entries</li>
        </ul>

        <p>To find specific items or patterns:</p>
        <ol>
          <li>Use the search bar for keywords</li>
          <li>Apply filters for:
            <ul>
              <li>Clay types</li>
              <li>Cone ranges</li>
              <li>Atmospheres</li>
              <li>Colours</li>
              <li>Sources</li>
            </ul>
          </li>
          <li>Sort results by any column in table view by clicking on the column heading</li>
        </ol>

        <h3 id="table-and-grid-view">Table and grid view</h3>
        <p>
          Your library of test tiles, clay bodies and decorations can be viewed as a table or in a grid. Table view maximises 
          the amount of text detail visible, whereas grid view shows larger images.
        </p>
        <p>You can search and filter in both table and grid view.</p>
        <p>To switch between views using the view toggle:</p>
        <ol>
          <li>Click the view toggle button above the table, on the right-hand side</li>
          <li>Your preferred view is automatically saved for each section</li>
        </ol>

        <h3 id="showing-and-hiding-columns">Showing and hiding columns</h3>
        <p>You can customise the appearance of the table on each page by showing or hiding columns.</p>
        <ol>
          <li>Click the 'Columns' button</li>
          <li>Select which columns to display</li>
          <li>Settings are saved automatically</li>
        </ol>
      </section>
    </div>
  )
} 