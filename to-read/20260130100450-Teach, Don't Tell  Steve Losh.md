---
type: "to-read"
id: 20260130100150
created: 2026-01-30T10:04:50
source:
  - "https://stevelosh.com/blog/2013/09/teach-dont-tell/"
tags:
reviewd: false
---
## Teach, Don't Tell

This post is about writing technical documentation. More specifically: it's about writing documentation for programming languages and libraries.

I love reading great documentation. When I have a question and the documentations explains the answer almost as if the author has magically anticipated my problem, I get a warm, fuzzy feeling inside. I feel a connection with the writer that makes me smile.

I also love writing documentation. Being able to rewire the neurons in someone's brain so that they understand something they didn't understand before is extremely satisfying. Seeing (or hearing about) the "click" when a bunch of concepts suddenly fall together and make sense never fails to make my day.

This post is going to be about what I think good documentation is and how I think you should go about writing it. I'm not perfect, so you should take everything with a grain of salt, but I hope you'll find it useful and thought-provoking even if you don't agree with me about everything.

I'd like to say thanks to [Craig Zheng](http://craigzheng.com/) and [Honza Pokorny](http://honza.ca/) for proofreading this.

## Prior Reading

Before you read this post there are two other things I think you should read first.

The first is Jacob Kaplan-Moss' [Writing Great Documentation](http://jacobian.org/writing/great-documentation/) series. He's certainly more qualified than I am to write about this stuff, so you should check that out if you haven't already. A lot of what I say here is going to agree with and build on the ideas he talked about.

The other thing you should read is [The Science of Scientific Writing](http://www.americanscientist.org/issues/id.877,y.0,no.,content.true,page.1,css.print/issue.aspx) by George Gopen and Judith Swan. Don't be put off by the fact that it's written for scientists publishing papers in journals. Everything in that article applies equally well to programmers writing technical docs. Read the entire thing. It's worth it.

## Why Do We Document?

Let's get started. The first thing to nail down is *why* we're documenting a programming language or library in the first place. There are many things you might want to accomplish, but I'm going to boil them down into a single statement:

**The purpose of technical documentation is to take someone who has never seen your project, teach them to be an expert user of it, and support them once they become an expert.**

At first glance this probably doesn't seem too controversial or interesting. But there's one word in there that makes *all* the difference, and it frames my entire perspective on documentation.

## Teaching

If you want to take a person who has never played the guitar and turn them into a virtuoso guitarist, how can you do that?

You *teach* them.

If you want to take a high school student and turn them into a computer scientist, how can you do that?

You *teach* them.

If you want to take a programmer who has never seen your library before and turn them into an expert user of it, how can you do that?

You *teach* them!

Guitar lessons are usually taught in person, one-on-one, with a teacher. Computer Science is usually taught by professors in classrooms. Programming library usage is usually taught by documentation.

If the goal of documentation is to turn novices into experts, then *the documentation must teach*. You should think of your documentation as a lesson (or series of lessons) because *that's what it is*.

When writing technical documentation you (usually) don't have the advantage of having a one-on-one dialog with the learners. This makes it a bit more difficult, but not impossible as long as you're careful. Your documentation needs to fill the role of both the in-person lessons *and* the textbook.

The rest of this post will be almost entirely about how to apply the "documentation is teaching" mindset to writing programming docs.

## A Play in Seven Acts

I'm going to break up the content of this post with some venting about *bad* documentation. If you want to skip these little rants, go ahead.

Each act in our play has two characters: a teenager and a parent. The teenager has just turned sixteen and would like to learn to drive so they can hang out with their friends without relying on their parents to drive them everywhere.

Each act will demonstrate a caricature of a particularly *bad* form of documentation. I hope these little metaphors will help show why certain forms of documentation are ineffective cop-outs and why you should write *real* documentation instead.

## Act 1: "Read the Source"

Our play starts with a son and father sitting at the breakfast table. The son is munching on some cereal before school while the father reads his iPad before leaving for work.

The son says: "Hey Dad, you said you were going to teach me how to drive after school today. Are we still going to do that?"

The father, without looking up from his iPad, replies: "Of course, son. The car is in the garage and I laid out a set of wrenches on the workbench. Take the car apart and look at each piece, then put it back together. Once you've done that I'll take you to the DMV for your driving test."

The son quietly continued eating his cereal.

If you use many open source libraries you've undoubtedly encountered some whose README says something like "read the source". Every time I see one, I die a little bit inside.

Source code is *not* documentation. Can you learn to be a guitarist by simply listening to a piece of music intently? Can you become a painter by visiting a lot of museums? Of course not!

Let me be clear: I'm not trying to say that reading source code isn't a valuable thing to do. It is!

Looking at other artists' paintings is extremely useful *once you know how to paint*. Learning how the brakes of a car are constructed can save your life,*once you know how to drive*.

Once your library's users know how to work with it, reading its source is absolutely worth their time. But you can't look at the finished product and understand the perspective and ideas that went into it without additional guidance. That's a job for documentation.

## Tools of the Trade

Writing good documentation doesn't take much in the way of tools.

For example: you don't need a thesaurus. Don't try to avoid using the same words by substituting synonyms. Just talk to your users like you would talk to another human being in real life!

If you use the same word ten times in a row your readers probably won't even notice. But I guarantee they're going to notice if you throw in strange, uncommon words for no good reason.

There are two tools I *will* recommend before moving on. The first isn't actually a tool, but a skill.

To write great documentation, you need to be able to type.

When you write docs you'll inevitably write yourself into a corner and realize you need to take a new direction. If you don't type quickly, you might be hesitant to throw away writing that doesn't really work. You need to learn to type well so you don't feel bad throwing away a chunk of a thousand words that don't fit.

Steve Yegge's article [Programming's Dirty Little Secret](http://steve-yegge.blogspot.com/2008/09/programmings-dirtiest-little-secret.html) is a great rant on this topic.

You should also get yourself a nice keyboard. A good keyboard won't make you a good writer (just like a good guitar won't make you a good guitarist), but it *will* make you want to write more just for the sheer joy of using a well-designed piece of equipment.

I started practicing guitar a lot more after I got a new guitar that was much nicer than my old one. If you spend a hundred dollars, get a nice keyboard, and end up wanting to write more, it was worth it!

Be thankful that a nice keyboard only costs $100 to $300 and not several thousand dollars like a nice instrument.

## Act 2: "Read the Tests"

The next scene opens with a mother picking her daughter up from high school.

"Hi Mom", she says, "are you still going to teach me to drive today?"

"Yep!" she replies. "Let's get going."

After ten minutes of driving they arrive at the Chevrolet factory.

The girl looks around, puzzled. She asks: "What are we doing here?"

The mother smiles and says: "You're in luck, honey, my friend Jim works here at the Chevy plant, and he's gonna let you watch a few crash tests of the new Malibu! Once you see a few cars smash into each other, I'll take you down to the DMV for your driving test."

Another common form of "documentation" is the README instructing users to "read the tests".

Tests aren't docs.

Again, let's be clear: once you already know how to use a library, reading the tests is *very* useful. But you need documentation to make you an expert user first!

You don't learn to drive by watching crash tests. But learning how your car behaves during a crash can save your life *once you know how to drive*.

A common argument I see goes something like this:

"The tests use the library, so they're a good example of how to use it!"

This is true in some very superficial sense, but completely misses the mark.

Most of the tests are probably going to deal with edge cases. Edge cases are things a normal user won't be encountering very often (otherwise they wouldn't be edge cases!).

If you're lucky, you might get a test that verifies the library works correctly on a normal set of input. But a "normal set of input" is what the users are going to be working with the majority the time!

Tests simply aren't a good guide to what a user is going to be encountering on a day-to-day basis. They can't teach a novice to be an expert.

## How to Teach

If you accept my idea that the purpose of documentation is to *teach* users, the next question is obviously: "How do I teach my users?"

I've been lucky enough to have the chance to teach dancing semi-formally for around 6 or 7 years, and lots of various other things informally for a long time. The only way to *really* learn how to teach is to *do it*.

There's no substitute for sitting down with someone face-to-face and teaching them something. **If you want to write better documentation, you need to practice teaching**.

I'm not talking about writing out lesson plans or anything nearly so formal. Do you have a hobby (not programming)? If so, spend a couple of hours on a weekend teaching a friend about it. You'll get some practice teaching and they'll get to learn something new.

(If you don't have any non-programming hobbies, maybe you should find some.)

If you like photography, teach someone the basics of exposure and composition. If you dance, teach them some basic steps. If you play an instrument, teach them how to play a simple song. If you like camping, teach them what all the gear is for. You get the idea.

Don't go overboard. You don't need to give someone a degree, you just need to practice teaching a little bit. You need to practice the art of rewiring someone's neurons with your words.

Once you jump into teaching something (even something simple) you'll probably realize that although you know how to do it yourself, it's a lot harder to teach someone else.

This is obvious when you're working face-to-face with someone. When you tell them how to play a C major chord on the guitar and they only produce a strangled squeak, it's clear that you need to slow down and talk about how to press down on the strings properly.

As programmers, we almost *never* get this kind of feedback about our documentation. We don't see that the person on the other end of the wire is hopelessly confused and blundering around because they're missing something we thought was obvious (but wasn't). Teaching someone in person helps you learn to anticipate this, which will pay off (for your users) when you're writing documentation.

With all that said, I do want to also talk a little about the actual process of teaching.

The best description of how to teach that I've seen so far is from the book [How to Solve It](http://www.amazon.com/dp/069111966X/?tag=stelos-20). Everyone who wants to teach should read this book. The passage that really jumped out at me is right in the first page of the first chapter:

> The best \[way for the teacher to help their student\] is to help the student naturally. The teacher should put himself in the student's place, he should see the student's case, he should try to understand what is going on in the student's mind, and ask a question or indicate a step that *could have occurred to the student himself*.

This, right here, is the core of teaching. This is it. This is how you do it.

People don't learn by simply absorbing lots of unstructured information as it's thrown at them. You can't read a Spanish dictionary to someone to teach them Spanish.

When you want to teach someone you need to put yourself in their shoes and walk along the path with them. Hold their hand, guide them around the dangerous obstacles and catch them when they fall. *Don't* carry them. *Certainly don't* just drive them to the destination in your car!

The process needs to go something like this:

1. Figure out what they already know.
2. Figure out what you want them to know after you finish.
3. Figure out a single idea or concept that will move state 1 a little bit closer to state 2.
4. Nudge the student in the direction of that idea.
5. Repeat until state 1 becomes state 2.

Too often I see documentation that has very carefully considered step 2, and then simply presents it to the reader as a pronouncement from God. That isn't teaching. That's telling. People don't learn by being *told*, they learn by being *taught*.

## Act 3: "Literate Programming"

The third act opens with a daughter talking to her mother the day before her sixteenth birthday.

"Hey Mom," she says, "I don't know if you got me a present yet, but if not, what I'd *really* like for my birthday are driving lessons."

The mother smiles and says: "Don't worry, it's all taken care of. Just wait for tomorrow."

The next day at her birthday party she unwraps the present from her mom. Inside is a DVD of the show How It's Made. She looks quizzically at her mother.

"That DVD has an episode about the factory that builds your car! Once you watch the whole thing I'll take you for your driving test."

A horrible trend I've noticed lately is using "literate programming" tools like Docco, Rocco, etc and telling users to read the results for documentation.

Programming languages and libraries are tools. Knowing how a tool was made doesn't mean you know how to use it. When you take guitar lessons, you don't visit a luthier to watch her shape a Telecaster out of Ash wood.

Knowing how your car was built can help you, *once you know how to drive*.

Knowing how your guitar was built can help you, *once you know how to play*.

A common theme throughout these acts/rants is that all of these things I'm picking on (source, tests, literate programming, and more) are good things with real benefits *once you have actual documentation in place to teach users*.

But until that happens, they're actually *bad* because they let you pretend you've written documentation and your job is done (JKM mentions this in his series). Your job is not done until you've taught your users enough to become experts. *Then* they can take advantage of all these extras.

## The Anatomy of Good Documentation

The rest of this post is going to be about the individual components that make up good documentation. My views are pretty similar to JKM's, so if you haven't read the series I mentioned in the first section you should probably do that.

In my mind I divide good documentation into roughly four parts:

1. First Contact
2. The Black Triangle
3. The Hairball
4. The Reference

There don't necessarily have to be four separate documents for each of these. In fact the first two can usually be combined into a single file, while the last two should probably be split into many pieces. But I think each component is a distinct, important part of good documentation.

Let's take a look at each.

## First Contact

When you release a new programming language or library into the wild, the initial state of your "users" is going to be blank. The things they need to know when they encounter your library are:

1. What is this thing?
2. Why would I care about this thing?
3. Is it worth the effort to learn this thing?

Your "first contact" documentation should explain these things to them.

You don't need to explain things from first principles. Try to put yourself in the shoes of your users. When you're teaching your teenager to drive, you don't need to explain what a "wheel" is. They probably have some experience with "things on wheels that you move around in" like lawn mowers or golf carts (or even video games).

Likewise: if you're creating a web framework, most of the people that stumble on to your project are probably going to know what "HTML" is. It's good to err a little bit on the side of caution and explain a little more than to assume too much, but you can be practical here.

Your "first contact" docs should explain what, in plain words, your thing does. It should show someone why they should care about that. Will it save them time? Will it take more time, but be more stable in exchange? Is it just plain fun?

For bonus points, you can also mention why someone might want to *not* use your project. Barely anyone ever mentions the tradeoffs involved with using their work, so to see a project do this is refreshing.

Finally, the user needs to know if it's worth spending some of their finite amount of time on this planet learning more about your project. You should explicitly spell out things like:

- What license the project uses (so they know if it's practical to use).
- Where the bug tracker is (so they can see issues).
- Where the source code is (so they can see if it's (relatively) recently maintained).
- Where the documentation is (so they can skim it and get an idea of the effort that's going to be involved in becoming an expert).

## Act 4: "Read the Docstrings"

Scene four. A father is finally making good on his promise to give his daughter driving lessons.

"Okay Dad," she says, "I'm ready. I've never driven a car before. Where do we start?"

A woman in her mid-forties walks through the door. "Who's this?" the daughter asks.

"This is your driving teacher, Ms. Smith." the father replies. "She's going to sit in the passenger seat with you while you drive the two hour trip to visit grandpa. If you have any questions about a part of the car while you're driving, you can ask her and she'll tell you all about that piece. Here are the keys, good luck!"

In languages with [docstrings](https://en.wikipedia.org/wiki/Docstring) there's a tendency to write great docstrings and call them documentation. I'm sure the "doc" in the word "docstrings" contributes to this.

Docstrings don't provide any organization or order (beyond "the namespace they happen to be implemented in"). Users need to somehow know the name of the function they need to even be able to *see* the docstring, and they can't know that unless you *teach* them.

Again, docstrings are great *once you know the project*. But when you're teaching a novice how to use your library, you need to guide them along they way and not sit back and answer questions when they manage to guess a magic word correctly.

## The Black Triangle

The next important piece of documentation is [the "black triangle"](http://rampantgames.com/blog/2004/10/black-triangle.html). It should be a relatively short guide to getting your project up and running so the user can poke at it.

This serves a couple of purposes. First, it lets the user verify that yes, this collection of bytes is actually going to run and *do something* on their machine. It's a quick sanity check that the project hasn't bit rotted and is still viable to use at that point in time. More importantly, it lets your prospective user [get some paint on the canvas](http://worrydream.com/LearnableProgramming/#react).

Imagine if you went to your first guitar lesson and the teacher said: "Okay, we're going to start by learning 150 different chords. Then in about six months we can play some songs." No guitar teacher does that. They teach you three chords and give you a couple of cheesy pop songs to play. It helps the student get a feel for what being a guitarist as a whole is going to be like, and it gives them something to help keep their interest.

Your "black triangle" documentation should be a short guide that runs the user through the process of retrieving, installing, and poking your project or language.

"Short" here is a relative word. Some projects are going to require more setup to get running. If the benefits are enough to justify the effort, that's not necessarily a problem. But try to keep this as short as possible. *Just get something on the screen* and move on.

## Act 5: "Read the API Docs"

Our next scene opens a year after the last, with the father from the last scene talking to his son.

(Sadly, the daughter in that scene died in a car crash because she didn't know to ask Ms. Smith about seatbelts before getting on the expressway. Ms. Smith was wearing hers, of course.)

"Okay son, I know you're a little scared of driving because of what happened to your sister, but I've fixed the problem."

He hands the young man an inch-thick book. "Asking Ms. Smith questions along the way clearly didn't work, so we had her write out a paragraph or two about each piece of your car. Go ahead and read the entire manual cover to cover and then drive down to see grandpa."

API documentation is like the user's manual of a car. When something goes wrong and you need to replace a tire it's a godsend. But if you're learning to drive it's not going to help you because *people don't learn by reading alphabetized lists of disconnected information*.

If you actually try to teach someone to use your project face-to-face, you'll probably find yourself talking about things in one namespace for a while, then switching to another to cover something related, then switching back to the first. Learning isn't a straight path through the alphabet, it's a zig-zaggy ramble through someone else's brain.

## The Hairball

This brings me to the next type of documentation: "the hairball". By now the user has hopefully seen the "first contact" docs and the "black triangle" docs. You've got them hooked and ready to learn, but they're still novices.

The "hairball" is the twisted, tangled maze of teaching that is going to take these novices and turn them into expert users. It's going to mold their brains, one nudge at a time, until they have a pretty good understanding of how your project works.

You'll usually want to organize the "hairball" into sections (unless this is a very small project). These sections will probably *kind of* line up with namespaces in your project's public API, but when it makes sense to deviate you should do so.

Don't be afraid to write. Be concise but err on the side of explaining a bit too much. Programmers are pretty good at skimming over things they already know, but if you forget to include a crucial connection it can leave your users lost and stumbling around in the woods.

You should have a table of contents that lists each section of the "hairball". And then each section should have its own table of contents that lists the sections inside it. A table of contents is a wonderful way to get a birds-eye view of what you're about to read, to prepare your brain for it. And of course it's also handy for navigating around.

This is where your hobby-teaching practice and your reading of How to Solve It are going to come in handy. Put yourself in a user's brain and figure out each little connective leap they're going to need to make to become an expert.

## Act 6: "Read the Wiki"

In the penultimate scene, a mother has signed her teenage son up for an after-school driving class.

On the first day, the teacher hands them a syllabus detailing what they're going to cover, talks about grading, and sends them home a bit early.

On the second day, she gives them a brief overview of the various pieces of a car and how they work together. She also talks about a few of the most important laws they'll need to be aware of.

On the third day, the teacher calls in sick and they have a substitute. He covers the material for half of the fifth day in the syllabus. He has to leave early, so he brings in his nineteen year old daughter to finish the class. She covers the first half of the fourth day's material.

The fourth day the students arrive to find a note on the door saying the class has been cancelled because the teacher is still sick and they can't find a substitute. There's a note saying "TODO: we'll talk about the material later."

The fifth day the teacher has partially recovered, so she returns and covers the material for the fifth day. It's a bit hard to understand her because she's had half a bottle of Nyquil and is slurring most of her words and keeps saying "cat" instead of "car".

All the students fail the driving test.

Wikis are an abomination. They are the worst form of "documentation".

First of all: assuming they work as intended, they have no coherent voice.

Have you ever taken a class with multiple teachers at once? Probably not, because it doesn't work very well (with exceptions for things like partnered dancing where there are distinct lead/follow parts).

Worse still: have you ever taken a class where there's one jackass in the room who keeps constantly raising his hand and offering his own (often incorrect) opinions? Wikis are like that, except they *actively encourage* random people to interrupt the teacher with their own interjections.

I can hear the objections now: "But putting our docs on a wiki means *anyone* can fix typos!"

Jesus. Christ.

"It makes it easy to fix typos" is a horrible argument for using a wiki.

First of all, as JKM says, you should have an editor (or at least someone to proofread) which will catch a lot of the typos.

And even if there *are* typos, they're one of the least important things you need to worry about anyway. Misspelling "their" isn't going to impact the effectiveness of your teaching very much. Your lessons being a disorganized mess because they were written by three different people across six months *is* going to make them less effective.

Keeping your documentation in a wiki also makes it hard or impossible to keep it where it belongs: in version control right alongside your code.

But all that is irrelevant because aside from Wikipedia itself and video game wikis, *they don't fucking work*.

The project maintainer sets up a wiki, sits back and pats herself on the back saying: "I have set up a way for other people to do this boring job of writing documentation for me. Now we wait."

Maybe one or two people fix some typos. A dude who thinks he understands a topic but actually doesn't writes some completely wrong docs. Maybe they get reverted, maybe they don't.

The project changes. A new user reads some of the (sparse) documentation which is now out of date. Eventually they discover this and complain only to be met with: "Well it's a wiki, fix it yourself!"

It is not the responsibility of the student to fix a broken lesson plan. For fuck's sake, *the entire point of having a teacher* is that they know what the students need to learn and the students don't!

It's completely okay to ask your students for criticism so you can improve your lesson plan. Asking "what parts did you find difficult?" is fine. It's another thing entirely to ask them to *write your lesson plan for you*.

Seriously: fuck wikis. They are bad and terrible. Do not use them. Take the time and effort to write some real documentation instead.

## The Reference

The final type of documentation is "the reference". This section is for the users who have traveled through the "hairball" and made it to the other side. They're now your experts, and the reference should support them as they use your project in their daily work.

This section should contain things that experienced users are likely to need, such as:

- "API documentation" for every user-facing part of your project.
- A full changelog, with particular attention to backwards-incompatible changes between versions.
- Details about the internal implementation of the project.
- Contribution policies (if your project accepts outside contributions).

Tools like JavaDoc can produce something that looks like the first, but I share the same opinion as Jacob Kaplan-Moss:

> Auto-generated documentation is almost worthless. At best it's a slightly improved version of simply browsing through the source, but most of the time it's easier just to read the source than to navigate the bullshit that these autodoc tools produce. About the only thing auto-generated documentation is good for is filling printed pages when contracts dictate delivery of a certain number of pages of documentation. I feel a particularly deep form of rage every time I click on a "documentation" link and see auto-generated documentation.
> 
> There's no substitute for documentation written, organized, and edited by hand.

Yes, you can probably find a tool to read your project's source and shit out some HTML files with the function names in them. Maybe it will even include the docstrings!

I would still urge you to write your API docs by hand. It's going to be a little more typing, but the results will be much better for a number of reasons.

API docs and docstrings, while similar, serve different purposes. Docstrings have to provide what you need in the heat of coding in a REPL-friendly format. API docs can afford the luxury of a bit more explanation, as well as links to other things the user might want to know while browsing them on their couch. API docs should also be Google-friendly.

A common objection here is that you're going to be retyping a lot of words. Copy and paste mostly solves that problem, and learning to type makes the rest a non-issue.

Some will say: "But copy and pasting is evil! You're duplicating effort! How will you keep the changes in the docstrings and the API docs in sync if they change?"

My opinion here is that if your public-facing API is changing often, you're probably going to be making your users' lives harder when they need to constantly update their code to work with yours. So the least you can do is make *your* life a little harder to provide them with the best documentation possible to help ease the pain.

Auto-generated documentation has no coherent voice. It pulls in everything in the code without regard for overall structure and vision. You can *probably* get away with it for the API docs in your "reference" documentation, or you could take some pride in your work and write the best docs possible!

## Act 7: "A New Hope"

The final act of our play is set in a mall parking lot on a Sunday afternoon. A single car is in the parking lot. Inside is a family: a mother and father who are teaching their son to drive.

They start by driving the car into the middle of the lot, away from any obstacles. The son gets into the driver's seat, and the parents explain briefly what the main controls do. They let him drive around the empty lot a bit to get a feel for how the car works.

When it's time for him to park he shifts to park and takes off his seatbelt. His mom reminds him of the control called a "parking brake". He realizes that he should use this when parking. A set of neurons is now linked in his brain and he will remember to use the parking brake properly for the rest of his life.

Over time the parents take their son driving many times, always being sure that they're putting him into situations he can handle (but will still learn from). He drives on a road, then learns to parallel park, then drives on a highway.

He has questions along the way. Sometimes the parents are ready with an answer. Sometimes the questions reveal something else missing deeper down in his knowledge which the parents correct.

Over time he learns more and more. He gets his license and begins driving on his own.

When he gets a flat tire he reads the owner's manual and fixes it.

He watches the How It's Made episode about his car because he's curious how the brakes which saved his life at a stop sign last week actually work.

His windshield wipers stop working one day. He opens up the hood and figures out the problem, fixing it himself.

One day he is hit by a drunk driver. He walks away with only bruises. He never saw the countless crash tests the engineers performed to create the airbag system, but they saved his life.

In the last scene we see the son many years later. His hair is a bit gray now, but otherwise he looks a lot like the teenager who forgot to use the parking brake.

He's in a car with his teenage daughter, and he's teaching her how to drive.