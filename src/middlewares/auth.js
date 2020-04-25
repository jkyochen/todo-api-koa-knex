module.exports = async (ctx, next) => {
    if (!ctx.isAuthenticated()) {
        ctx.throw(401, {
            data: { message: "Unauthorized login user" },
        });
        return;
    }
    await next();
};
