import { Job } from '../job';

it('implements optimistic concurrency control', async (done) => {
    // Create an instance of a job
    const job = Job.build({
        title: 'concert',
        price: 5,
        userId: '123',
    });

    // Save the job to the database
    await job.save();

    // fetch the job twice
    const firstInstance = await Job.findById(job.id);
    const secondInstance = await Job.findById(job.id);

    // make two separate changes to the jobs we fetched
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    // save the first fetched job
    await firstInstance!.save();

    // save the second fetched job and expect an error
    try {
        await secondInstance!.save();
    } catch (err) {
        return done();
    }

    throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
    const job = Job.build({
        title: 'concert',
        price: 20,
        userId: '123',
    });

    await job.save();
    expect(job.version).toEqual(0);
    await job.save();
    expect(job.version).toEqual(1);
    await job.save();
    expect(job.version).toEqual(2);
});
