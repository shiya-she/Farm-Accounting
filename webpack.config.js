import webpack from '@nativescript/webpack';

export default (env: unknown) => {
  webpack.init(env);
  return webpack.resolveConfig();
};
